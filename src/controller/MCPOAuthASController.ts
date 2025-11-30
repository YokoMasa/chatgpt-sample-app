import { mcpAuthRouter } from "@modelcontextprotocol/sdk/server/auth/router.js";
import { OAuthClientRepository } from "../domain/repository/OAuthClientRepository.js";
import { OAuthClient } from "../domain/entity/OAuthClient.js";
import type { OAuthClientInformationFull } from "@modelcontextprotocol/sdk/shared/auth.js";
import { Scope } from "../domain/vo/Scope.js";

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

const repo = OAuthClientRepository.getInstance();

export default mcpAuthRouter({
  issuerUrl: new URL("https://test.com"),
  provider: {
    clientsStore: {
      getClient: clientId => {
        const client = repo.findById(clientId);
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
        repo.save(client);
        return mapClientToSDKForm(client);
      }
    }
  }
});