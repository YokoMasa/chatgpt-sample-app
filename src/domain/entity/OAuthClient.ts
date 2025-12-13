import { randomUUID } from "crypto";
import { Scope } from "../vo/Scope.js";
import { DomainError } from "../DomainError.js";
import type { OAuthClientInformationFull } from "@modelcontextprotocol/sdk/shared/auth.js";

export class OAuthClient {
  private id: string;
  private secret: string;
  private createdAt: Date;
  private redirectUris: URL[];
  private name: string;
  private clientUri: URL | undefined;
  private logoUri: URL | undefined;
  private scopes: Set<Scope>;
  private contacts: string[];
  private termsOfServiceUri: URL | undefined;
  private privacyPolicyUri: URL | undefined;
  private softwareId: string | undefined;
  private softwareVersion: string | undefined;

  constructor({
    redirectUris,
    name,
    clientUri,
    logoUri,
    scopes,
    contacts,
    termsOfServiceUri,
    privacyPolicyUri,
    softwareId,
    softwareVersion
  }: {
    redirectUris: URL[];
    name?: string | undefined;
    clientUri?: URL | undefined;
    logoUri?: URL | undefined;
    scopes?: Scope[] | undefined;
    contacts?: string[] | undefined;
    termsOfServiceUri?: URL | undefined;
    privacyPolicyUri?: URL | undefined;
    softwareId?: string | undefined;
    softwareVersion?: string | undefined;
  }) {
    this.id = randomUUID();
    this.secret = randomUUID();
    this.createdAt = new Date();
    if (redirectUris.length === 0) {
      throw new DomainError("redirect_uri must be specified.");
    }
    this.redirectUris = redirectUris;
    this.name = name != null ? name : this.id;
    this.clientUri = clientUri;
    this.logoUri = logoUri;
    if (scopes != null && scopes.length === 0) {
      throw new DomainError("scope must be specified.");
    }
    this.scopes = new Set(scopes != null ? scopes : [Scope.MCP_DEFAULT]);
    this.contacts = contacts != null ? contacts : [];
    this.termsOfServiceUri = termsOfServiceUri;
    this.privacyPolicyUri = privacyPolicyUri;
    this.softwareId = softwareId;
    this.softwareVersion = softwareVersion;
  }

  public static from(args: Omit<OAuthClientInformationFull, 'client_id' | 'client_id_issued_at'>) {
    return new OAuthClient({
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
  }

  public getId() {
    return this.id;
  }

  public getSecret() {
    return this.secret;
  }

  public getName() {
    return this.name;
  }

  public getCreatedAt() {
    return this.createdAt;
  }

  public getClientUri() {
    return this.clientUri;
  }

  public getLogoUri() {
    return this.logoUri;
  }

  public getScopes() {
    return this.scopes.values();
  }

  public hasScope(scopeStr: string) {
    return this.scopes.has(Scope.fromString(scopeStr));
  }

  public hasScopes(scopeStrs: string[]) {
    return scopeStrs.every(scopeStr => this.hasScope(scopeStr));
  }

  public getContacts() {
    return this.contacts.values();
  }

  public getTermsOfServiceUri() {
    return this.termsOfServiceUri;
  }

  public getPrivacyPolicyUri() {
    return this.privacyPolicyUri;
  }

  public getSoftwareId() {
    return this.softwareId;
  }

  public getSoftwareVersion() {
    return this.softwareVersion;
  }

  public getRedirectUri() {
    return this.redirectUris.values();
  }

  public hasRedirectUri(redirectUri: URL) {
    return this.redirectUris.some(uri => uri.toString() === redirectUri.toString());
  }

  public getRedirectUriCount() {
    return this.redirectUris.length;
  }
}