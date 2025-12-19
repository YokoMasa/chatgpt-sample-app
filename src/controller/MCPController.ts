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

const controller = Router();

const mcpServer = new McpServer({
  name: '○×商店 MCP Server',
  version: '1.0.0'
});

mcpServer.registerTool(
  "searchProductByNames",
  {
    title: "searchProductByNames",
    description: "Search products by names.",
    inputSchema: {
      names: z.array(z.string())
    }
  },
  async ({ names }) => {
    console.log(`TOOL: searchProductByNames, ARGS: ${JSON.stringify(names)}`);
    const products = ProductRepository.getInstance().findByNames(names);
    return {
      content: [
        { type: "text", text: JSON.stringify(products) }
      ]
    }
  }
);

mcpServer.registerTool(
  "addProductsToCart",
  {
    title: "addProductsToCart",
    description: "Add specified products to cart.",
    inputSchema: {
      items: z.array(
        z.object({
          productId: z.number(),
          quantity: z.number()
        })
      )
    }
  },
  async ({ items }, { authInfo }) => {
    console.log(`TOOL: addProductsToCart, ARGS: ${JSON.stringify(items)}`);
    const userId = authInfo?.extra?.userId;
    if (userId == null || typeof userId !== "string") {
      throw new Error("Invalid user.");
    }

    const cartRepo = CartRepository.getInstance();
    const productRepo = ProductRepository.getInstance();
    const cart = cartRepo.findByUserId(userId) ?? new Cart(userId);

    for (const { productId, quantity } of items) {
      const product = productRepo.findById(productId);
      if (product != null) {
        cart.addItem(new CartItem(product, quantity));
      }
    }
    cartRepo.save(cart);

    return {
      content: [
        { type: "text", text: "Items added to cart." }
      ]
    }
  }
);

mcpServer.registerTool(
  "listItemsInCart",
  {
    title: "listItemsInCart",
    description: "List items in cart.",
  },
  async ({ authInfo }) => {
    console.log(`TOOL: listItemsInCart`);
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
        quantity: item.getQuantity()
      }))
      .toArray()

    return {
      content: [
        { type: "text", text: JSON.stringify(items) },
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
      sessionIdGenerator: undefined,
      enableJsonResponse: true
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