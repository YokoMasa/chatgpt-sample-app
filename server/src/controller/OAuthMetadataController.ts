import { mcpAuthMetadataRouter } from "@modelcontextprotocol/sdk/server/auth/router.js";
import { ENV } from "../utils/Env.js";
import { Scope } from "../domain/vo/Scope.js";
import type { OAuthMetadata } from "@modelcontextprotocol/sdk/shared/auth.js";

export const OAUTH_METADATA: OAuthMetadata = {
  issuer: ENV.baseUrl,
  authorization_endpoint: ENV.baseUrl + "/oauth/authorize",
  token_endpoint: ENV.baseUrl + "/oauth/token",
  registration_endpoint: ENV.baseUrl + "/oauth/client",
  scopes_supported: [Scope.MCP_DEFAULT],
  response_types_supported: ["code"],
  grant_types_supported: ["authorization_code"],
  token_endpoint_auth_methods_supported: ["client_secret_post"],
  code_challenge_methods_supported: ["S256"]
}

const controller = mcpAuthMetadataRouter({
  oauthMetadata: OAUTH_METADATA,
  resourceServerUrl: new URL(ENV.baseUrl + "/mcp"),
  scopesSupported: [Scope.MCP_DEFAULT],
});

export default controller;