import { Router } from "express";
import { clientRegistrationHandler } from "@modelcontextprotocol/sdk/server/auth/handlers/register.js";
import SessionCheckMiddleware from "../auth/SessionCheckMiddleware.js";
import { authorizationHandler } from "@modelcontextprotocol/sdk/server/auth/handlers/authorize.js";
import { OAuthService } from "../auth/OAuthService.js";
import { tokenHandler } from "@modelcontextprotocol/sdk/server/auth/handlers/token.js";
import { OAuthClientStore } from "../auth/OAuthClientStore.js";

const controller = Router();

// DCR Endpoint
controller.use(
  "/oauth/client",
  clientRegistrationHandler({
    clientsStore: OAuthClientStore.getInstance(),
    clientIdGeneration: false
  }
));

// Authorization Endpoint (shows consent screen)
controller.use(
  "/oauth/authorize",
  SessionCheckMiddleware,
  authorizationHandler({
    provider: {
      clientsStore: OAuthClientStore.getInstance(),
      authorize: async (client, params, res) => {
        res.render("authorize", {
          clientName: client.client_name ?? client.client_id,
          scopes: client.scope != null ? client.scope.split(" ") : [],
          redirectUrl: params.redirectUri
        });
      },
      challengeForAuthorizationCode: async (_client, _authorizationCode) => {
        throw new Error("Function not implemented.");
      },
      exchangeAuthorizationCode: async (_client, _authorizationCode, _codeVerifier, _redirectUri, _resource) => {
        throw new Error("Function not implemented.");
      },
      exchangeRefreshToken: async (_client, _refreshToken, _scopes, _resource) => {
        throw new Error("Function not implemented.");
      },
      verifyAccessToken: async _token => {
        throw new Error("Function not implemented.");
      }
    }
  })
);

// Authorization Endpoint (performs redirect)
controller.use(
  "/oauth/do_authorize",
  SessionCheckMiddleware,
  authorizationHandler({
    provider: OAuthService.getInstance()
  }
));

// Token Endpoint
controller.use(
  "/oauth/token",
  tokenHandler({
    provider: OAuthService.getInstance()
  })
);

export default controller;