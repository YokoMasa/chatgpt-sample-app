import { requireBearerAuth } from "@modelcontextprotocol/sdk/server/auth/middleware/bearerAuth.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { Router } from "express";
import z from "zod";
import { OAuthService } from "../auth/OAuthService.js";
import { Scope } from "../domain/vo/Scope.js";
import { ProductRepository } from "../domain/repository/ProductRepository.js";
import { ENV } from "../utils/Env.js";
import { CartRepository } from "../domain/repository/CartRepository.js";
import { Cart } from "../domain/entity/Cart.js";
import { CartItem } from "../domain/entity/CartItem.js";
import { readFile } from "fs/promises";

const controller = Router();

const productWidgetHtml = await readFile(`${ENV.widgetDir}/ProductWidget.html`, { encoding: "utf8" });
const cartWidgetHtml = await readFile(`${ENV.widgetDir}/CartWidget.html`, { encoding: "utf8" });

const mcpServer = new McpServer({
  name: '○×商店 MCP Server',
  version: '1.0.0'
});

mcpServer.registerResource(
  "product-widget",
  "ui://widget/product-widget.html",
  {},
  async () => ({
    contents: [
      {
        uri: "ui://widget/product-widget.html",
        mimeType: "text/html+skybridge",
        text: productWidgetHtml.trim(),
        _meta: {
          "openai/widgetDescription": "This widget shows detailed information about a single product.",
          "openai/widgetPrefersBorder": true,
          "openai/widgetDomain": ENV.baseUrl,
          "openai/widgetCSP": {
            connect_domains: [ENV.baseUrl],
            resource_domains: [ENV.baseUrl]
          }
        }
      }
    ]
  })
);

mcpServer.registerResource(
  "cart-widget",
  "ui://widget/cart-widget.html",
  {},
  async () => ({
    contents: [
      {
        uri: "ui://widget/cart-widget.html",
        mimeType: "text/html+skybridge",
        text: cartWidgetHtml.trim(),
        _meta: {
          "openai/widgetDescription": "This widget shows current items in cart.",
          "openai/widgetPrefersBorder": true,
          "openai/widgetDomain": ENV.baseUrl,
          "openai/widgetCSP": {
            connect_domains: [ENV.baseUrl],
            resource_domains: [ENV.baseUrl]
          }
        }
      }
    ]
  })
);

mcpServer.registerTool(
  "searchProductByNames",
  {
    title: "searchProductByNames",
    description: "Search products by names.",
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      openWorldHint: false
    },
    inputSchema: {
      names: z.array(z.string())
    },
    _meta: {
      "openai/outputTemplate": "ui://widget/product-widget.html"
    }
  },
  async ({ names }) => {
    const products = ProductRepository.getInstance().findByNames(names);
    return {
      content: [
        { type: "text", text: JSON.stringify(products) }
      ],
      structuredContent: {
        products: products.map(p => ({
          id: p.id,
          name: p.name,
          imagePath: p.imagePath
        }))
      }
    }
  }
);

mcpServer.registerTool(
  "updateItemsInCart",
  {
    title: "updateItemsInCart",
    description: "Put specified items in the cart. Items not specified in the tool call input but already put in the cart are removed from the cart.",
    annotations: {
      readOnlyHint: false,
      destructiveHint: true,
      openWorldHint: false
    },
    inputSchema: {
      items: z.array(
        z.object({
          productId: z.number(),
          quantity: z.number()
        })
      )
    },
    _meta: {
      "openai/outputTemplate": "ui://widget/cart-widget.html"
    }
  },
  async ({ items }, { authInfo }) => {
    const userId = authInfo?.extra?.userId;
    if (userId == null || typeof userId !== "string") {
      throw new Error("Invalid user.");
    }

    const cartRepo = CartRepository.getInstance();
    const productRepo = ProductRepository.getInstance();
    const cart = cartRepo.findByUserId(userId) ?? new Cart(userId);

    cart.clear();

    for (const { productId, quantity } of items) {
      const product = productRepo.findById(productId);
      if (product != null) {
        cart.addItem(new CartItem(product, quantity));
      }
    }
    cartRepo.save(cart);

    return {
      content: [
        {
          type: "text",
          text: `Items in cart updated. Current items in cart: ${
            cart
              .listItems()
              .map(item => item.getProduct().name + "*" + item.getQuantity())
              .toArray()
              .join(", ")
          }`
        }
      ],
      structuredContent: {
        items: cart.listItems()
          .map(item => ({
            id: item.getId(),
            productName: item.getProduct().name,
            productId: item.getProduct().id,
            productImagePath: item.getProduct().imagePath,
            quantity: item.getQuantity()
          }))
          .toArray()
      }
    };
  }
);

mcpServer.registerTool(
  "listItemsInCart",
  {
    title: "listItemsInCart",
    description: "List items in cart.",
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      openWorldHint: false
    },
    _meta: {
      "openai/outputTemplate": "ui://widget/cart-widget.html"
    }
  },
  async ({ authInfo }) => {
    const userId = authInfo?.extra?.userId;
    if (userId == null || typeof userId !== "string") {
      throw new Error("Invalid user.");
    }

    const cartRepo = CartRepository.getInstance();
    const cart = cartRepo.findByUserId(userId) ?? new Cart(userId);

    const items = cart.listItems()
      .map(item => ({
        id: item.getId(),
        productName: item.getProduct().name,
        productId: item.getProduct().id,
        productImagePath: item.getProduct().imagePath,
        quantity: item.getQuantity()
      }))
      .toArray()

    return {
      content: [
        {
          type: "text",
          text: cart
            .listItems()
            .map(item => item.getProduct().name + "*" + item.getQuantity())
            .toArray()
            .join(", ")
        },
      ],
      structuredContent: {
        items
      }
    }
  }
);

const bearerAuthMiddleware = requireBearerAuth({
  verifier: OAuthService.getInstance(),
  requiredScopes: [Scope.MCP_DEFAULT],
  resourceMetadataUrl: ENV.baseUrl + "/.well-known/oauth-protected-resource/mcp"
});
controller.post('/', bearerAuthMiddleware, async (req, res) => {
  try {
    const transport = new StreamableHTTPServerTransport({
      enableJsonResponse: true,
    });
    
    res.on('close', () => {
      transport.close();
    });
    
    await mcpServer.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error('Error handling MCP request:', error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: '2.0',
        error: {
          code: -32603,
          message: 'Internal server error'
        },
        id: null
      });
    }
  }
});

export default controller;