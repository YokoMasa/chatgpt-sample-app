import type { OAuthRegisteredClientsStore } from "@modelcontextprotocol/sdk/server/auth/clients.js";
import type { AuthorizationParams, OAuthServerProvider } from "@modelcontextprotocol/sdk/server/auth/provider.js";
import type { AuthInfo } from "@modelcontextprotocol/sdk/server/auth/types.js";
import type { OAuthClientInformationFull, OAuthTokens } from "@modelcontextprotocol/sdk/shared/auth.js";
import type { Response } from "express";

export class OAuthService implements OAuthServerProvider {

  get clientsStore(): OAuthRegisteredClientsStore {
    throw new Error("Method not implemented.");
  }

  public async authorize(
    client: OAuthClientInformationFull,
    params: AuthorizationParams,
    res: Response
  ) {
    throw new Error("Method not implemented.");
  }

  public async challengeForAuthorizationCode(
    client: OAuthClientInformationFull,
    authorizationCode: string
  ): Promise<string> {
    throw new Error("Method not implemented.");
  }

  public async exchangeAuthorizationCode(
    client: OAuthClientInformationFull,
    authorizationCode: string,
    codeVerifier?: string,
    redirectUri?: string,
    resource?: URL
  ): Promise<OAuthTokens> {
    throw new Error("Method not implemented.");
  }

  public async exchangeRefreshToken(
    client: OAuthClientInformationFull,
    refreshToken: string,
    scopes?: string[],
    resource?: URL
  ): Promise<OAuthTokens> {
    throw new Error("Method not implemented.");
  }

  public async verifyAccessToken(token: string): Promise<AuthInfo> {
    throw new Error("Method not implemented.");
  }

}