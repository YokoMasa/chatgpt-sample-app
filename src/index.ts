import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express, { type ErrorRequestHandler } from "express";
import z from "zod";
import session from "express-session";
import { handlebarsEngine } from "./view/HandlebarsEngine.js";
import MyPageController from "./controller/MyPageController.js";
import NotFoundController from "./controller/NotFoundController.js";
import LoginController from "./controller/LoginController.js";
import { LRUCacheSessionStore } from "./auth/LRUCacheSessionStore.js";
import LogoutController from "./controller/LogoutController.js";
import MCPOAuthASController from "./controller/MCPOAuthASController.js";

declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

const expressApp = express();

// view settings
expressApp.engine("html", handlebarsEngine);
expressApp.set("view engine", "html");
expressApp.set("views", "src/view/templates");

expressApp.set("x-powered-by", false);
expressApp.use(express.json());
expressApp.use(session({
  secret: process.env.SESSION_SECRET == null
    ? "session_secret"
    : process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  unset: "destroy",
  store: new LRUCacheSessionStore(100)
}));

// controllers
expressApp.use("/login", LoginController);
expressApp.use("/logout", LogoutController);
expressApp.use("/mypage", MyPageController);
expressApp.use("/", MyPageController);
expressApp.use(MCPOAuthASController);

const mcpServer = new McpServer({
  name: 'example-server',
  version: '1.0.0'
});

// Set up your tools, resources, and prompts
mcpServer.registerTool(
  'echo',
  {
    title: 'Echo Tool',
    description: 'Echoes back the provided message',
    inputSchema: { message: z.string() },
    outputSchema: { echo: z.string() }
  },
  async ({ message }) => {
    const output = { echo: `Tool echo: ${message}` };
    return {
      content: [{ type: 'text', text: JSON.stringify(output) }],
      structuredContent: output
    };
  }
);

expressApp.post('/mcp', async (req, res) => {
  // In stateless mode, create a new transport for each request to prevent
  // request ID collisions. Different clients may use the same JSON-RPC request IDs,
  // which would cause responses to be routed to the wrong HTTP connections if
  // the transport state is shared.
  
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

// Not Found Page
expressApp.all(/.*/, NotFoundController);

// Error Page
expressApp.use(((error, _, res, next) => {
  console.error(error);
  if (res.headersSent) {
    return next(error);
  }
  res.render("error", { message: error.message ?? "予期せぬエラーが発生しました。" });
}) as ErrorRequestHandler);

const port = parseInt(process.env.PORT || '3000');
expressApp.listen(port, () => {
  console.log(`MCP Server running on http://localhost:${port}/mcp`);
}).on('error', error => {
  console.error('Server error:', error);
  process.exit(1);
});