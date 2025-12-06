import type { OAuthRegisteredClientsStore } from "@modelcontextprotocol/sdk/server/auth/clients.js";
import type { AuthorizationParams, OAuthServerProvider } from "@modelcontextprotocol/sdk/server/auth/provider.js";
import type { AuthInfo } from "@modelcontextprotocol/sdk/server/auth/types.js";
import type { OAuthClientInformationFull, OAuthTokens } from "@modelcontextprotocol/sdk/shared/auth.js";
import type { Response } from "express";
import { OAuthClientRepository } from "../domain/repository/OAuthClientRepository.js";
import { OAuthGrantRepository } from "../domain/repository/OAuthGrantRepository.js";
import { OAuthClient } from "../domain/entity/OAuthClient.js";
import { Scope } from "../domain/vo/Scope.js";

const clientRepo = OAuthClientRepository.getInstance();
const grantRepo = OAuthGrantRepository.getInstance();

function mapClientToSDKForm(client: OAuthClient): OAuthClientInformationFull {
  return {
    client_id: client.getId(),
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
      scopes: args.scope != null ? args.scope.split(",").map(Scope.fromString) : undefined,
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