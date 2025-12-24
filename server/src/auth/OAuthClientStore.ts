import type { OAuthRegisteredClientsStore } from "@modelcontextprotocol/sdk/server/auth/clients.js";
import type { OAuthClientInformationFull } from "@modelcontextprotocol/sdk/shared/auth.js";
import { OAuthClient } from "../domain/entity/OAuthClient.js";
import type { OAuthClientRepository } from "../domain/repository/OAuthClientRepository.js";
import { Scope } from "../domain/vo/Scope.js";

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
    scope: [...client.getScopes()].join(" "),
    contacts: [...client.getContacts()],
    tos_uri: client.getTermsOfServiceUri()?.toString(),
    policy_uri: client.getPrivacyPolicyUri()?.toString(),
    software_id: client.getSoftwareId(),
    software_version: client.getSoftwareVersion(),
    client_id_issued_at: Math.floor(client.getCreatedAt().getTime() / 1000),
    client_secret_expires_at: Math.floor(client.getExpiresAt().getTime() / 1000)
  };
}

export class OAuthClientStore implements OAuthRegisteredClientsStore {

  private static instance: OAuthClientStore;

  public static init(clientRepo: OAuthClientRepository) {
    if (this.instance == null) {
      this.instance = new OAuthClientStore(clientRepo);
    }
  }

  public static getInstance() {
    if (this.instance == null) {
      throw new Error("Call init() first!");
    }
    return this.instance;
  }

  private clientRepo: OAuthClientRepository;

  private constructor(clientRepo: OAuthClientRepository) {
    this.clientRepo = clientRepo;
  }

  public getClient(clientId: string) {
    const client = this.clientRepo.findById(clientId);
    if (client == null) {
      return undefined;
    }

    return mapClientToSDKForm(client);
  }

  public registerClient(args: Omit<OAuthClientInformationFull, "client_id" | "client_id_issued_at">) {
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
    this.clientRepo.save(client);
    return mapClientToSDKForm(client);
  }

}