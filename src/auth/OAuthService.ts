import type { OAuthRegisteredClientsStore } from "@modelcontextprotocol/sdk/server/auth/clients.js";
import type { AuthorizationParams, OAuthServerProvider } from "@modelcontextprotocol/sdk/server/auth/provider.js";
import type { AuthInfo } from "@modelcontextprotocol/sdk/server/auth/types.js";
import type { OAuthClientInformationFull, OAuthTokens } from "@modelcontextprotocol/sdk/shared/auth.js";
import type { Response } from "express";
import { OAuthClientRepository } from "../domain/repository/OAuthClientRepository.js";
import { OAuthGrantRepository } from "../domain/repository/OAuthGrantRepository.js";
import { OAuthClient } from "../domain/entity/OAuthClient.js";
import { Scope } from "../domain/vo/Scope.js";
import { OAuthGrant } from "../domain/entity/OAuthGrant.js";
import { InvalidClientError, InvalidGrantError, InvalidRequestError, InvalidScopeError, UnsupportedGrantTypeError } from "@modelcontextprotocol/sdk/server/auth/errors.js";
import { OAuthSessionRepository } from "../domain/repository/OAuthSessionRepository.js";
import { OAuthSession } from "../domain/entity/OAuthSession.js";

const clientRepo = OAuthClientRepository.getInstance();
const sessionRepo = OAuthSessionRepository.getInstance();
const grantRepo = OAuthGrantRepository.getInstance();

function mapClientToSDKForm(client: OAuthClient): OAuthClientInformationFull {
  return {
    client_id: client.getId(),
    client_secret: client.getSecret(),
    redirect_uris: [...client.getRedirectUri().map(uri => uri.toString())],
    token_endpoint_auth_method: "client_secret_post",
    grant_types: ["authorization_code"],
    response_types: ["code"],
    client_name: client.getName(),
    client_uri: client.getClientUri()?.toString(),
    logo_uri: client.getLogoUri()?.toString(),
    scope: [...client.getScopes()].join(","),
    contacts: [...client.getContacts()],
    tos_uri: client.getTermsOfServiceUri()?.toString(),
    policy_uri: client.getPrivacyPolicyUri()?.toString(),
    software_id: client.getSoftwareId(),
    software_version: client.getSoftwareVersion()
  };
}

export const OAuthClientStore: OAuthRegisteredClientsStore = {
  getClient: clientId => {
    const client = clientRepo.findById(clientId);
    if (client == null) {
      return undefined;
    }

    return mapClientToSDKForm(client);
  },
  registerClient: args => {
    const client = new OAuthClient({
      redirectUris: args.redirect_uris.map(uriStr => new URL(uriStr)),
      name: args.client_name,
      clientUri: args.client_uri != null ? new URL(args.client_uri) : undefined,
      logoUri: args.logo_uri != null ? new URL(args.logo_uri) : undefined,
      scopes: args.scope != null ? args.scope.split(" ").map(Scope.fromString) : undefined,
      contacts: args.contacts,
      termsOfServiceUri: args.tos_uri != null ? new URL(args.tos_uri) : undefined,
      privacyPolicyUri: args.policy_uri != null ? new URL(args.policy_uri) : undefined,
      softwareId: args.software_id,
      softwareVersion: args.software_version
    });
    clientRepo.save(client);
    return mapClientToSDKForm(client);
  }
}

export class OAuthService implements OAuthServerProvider {

  get clientsStore(): OAuthRegisteredClientsStore {
    return OAuthClientStore;
  }

  public async authorize(
    { client_id }: OAuthClientInformationFull,
    params: AuthorizationParams,
    res: Response
  ) {
    const client = clientRepo.findById(client_id);
    if (client == null) {
      throw new InvalidClientError("Client not found.");
    }
    if (params.scopes != null && !client.hasScopes(params.scopes)) {
      throw new InvalidScopeError("Invalid scope.");
    }

    const userId = res.req.session.userId;
    if (userId == null) {
      throw new InvalidRequestError("Unauthenticated.");
    }

    const oAuthSession = new OAuthSession({
      client,
      userId,
      requestedScopes: params.scopes != null ? params.scopes.map(Scope.fromString) : [Scope.MCP_DEFAULT],
      codeChallenge: params.codeChallenge
    });
    sessionRepo.save(oAuthSession);

    const redirectParams = new URLSearchParams();
    redirectParams.set("code", oAuthSession.getAuthorizationCode());
    params.state != null && redirectParams.set("state", params.state);

    const redirectUrl = `${params.redirectUri}?${redirectParams.toString()}`;
    res.redirect(redirectUrl);
  }

  public async challengeForAuthorizationCode(
    { client_id }: OAuthClientInformationFull,
    authorizationCode: string
  ): Promise<string> {
    const oAuthSession = sessionRepo.findByCode(authorizationCode);
    if (oAuthSession == null || oAuthSession.getClientId() !== client_id) {
      throw new InvalidGrantError("Invalid grant.");
    }
    return oAuthSession.getCodeChallenge();
  }

  public async exchangeAuthorizationCode(
    { client_id }: OAuthClientInformationFull,
    authorizationCode: string,
    _codeVerifier?: string,
    _redirectUri?: string,
    _resource?: URL
  ): Promise<OAuthTokens> {
    const oAuthSession = sessionRepo.findByCode(authorizationCode);
    if (
      oAuthSession == null
      || oAuthSession.getClientId() !== client_id
      || oAuthSession.isExpired()
    ) {
      throw new InvalidGrantError("Invalid grant.");
    }

    // https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1-13#name-reuse-of-authorization-code
    const existingGrant = oAuthSession.getGrant();
    if (existingGrant != null) {
      sessionRepo.delete(oAuthSession);
      grantRepo.delete(existingGrant);
      throw new InvalidGrantError("This code is already used. Revoking existing token.");
    }

    const grant = OAuthGrant.fromSession(oAuthSession);
    grantRepo.save(grant);

    return {
      access_token: "TOKEN",
      token_type: "Bearer"
    }
  }

  public async exchangeRefreshToken(
    _client: OAuthClientInformationFull,
    _refreshToken: string,
    _scopes?: string[],
    _resource?: URL
  ): Promise<OAuthTokens> {
    throw new UnsupportedGrantTypeError("refresh_token is not supported.");
  }

  public async verifyAccessToken(token: string): Promise<AuthInfo> {
    throw new Error("Method not implemented.");
  }

}