import { requireBearerAuth } from "@modelcontextprotocol/sdk/server/auth/middleware/bearerAuth.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { Router } from "express";
import z from "zod";
import { OAuthService } from "../auth/OAuthService.js";
import { Scope } from "../domain/vo/Scope.js";

const controller = Router();

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
  async ({ message }, { authInfo }) => {
    const output = { echo: `Tool echo: ${message}. Authorized as: ${authInfo?.extra?.userId}` };
    return {
      content: [{ type: 'text', text: JSON.stringify(output) }],
      structuredContent: output
    };
  }
);

const bearerAuthMiddleware = requireBearerAuth({
  verifier: OAuthService.getInstance(),
  requiredScopes: [Scope.MCP_DEFAULT],
  resourceMetadataUrl: "" // TODO: RS metadata url
});
controller.post('/', bearerAuthMiddleware, async (req, res) => {
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

export default controller;