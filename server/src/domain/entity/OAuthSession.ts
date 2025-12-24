import { getRandomValues } from "crypto";
import type { OAuthClient } from "./OAuthClient.js";
import type { OAuthGrant } from "./OAuthGrant.js";
import type { Scope } from "../vo/Scope.js";

const TEN_MINUTES_MILLIS = 1000 * 60 * 10;

export class OAuthSession {
  private clientId: string;
  private userId: string;
  private requestedScopes: Scope[];
  private authorizationCode: string;
  private codeChallenge: string;
  private expiresAt: Date;
  private grant: OAuthGrant | null = null;

  constructor({
    client,
    userId,
    requestedScopes,
    codeChallenge
  }: {
    client: OAuthClient;
    userId: string;
    requestedScopes: Scope[];
    codeChallenge: string;
  }) {
    if (!client.hasScopes(requestedScopes)) {
      throw new Error("Requested scopes are not valid.");
    }

    this.clientId = client.getId();
    this.userId = userId;
    this.requestedScopes = requestedScopes;
    this.codeChallenge = codeChallenge;
    const randomBytes = Buffer.alloc(96);
    getRandomValues(randomBytes);
    this.authorizationCode = randomBytes.toString("base64url").replace(/=/g, "");
    this.expiresAt = new Date(Date.now() + TEN_MINUTES_MILLIS);
  }

  public getClientId() {
    return this.clientId;
  }

  public getUserId() {
    return this.userId;
  }

  public getRequestedScopes() {
    return this.requestedScopes;
  }

  public getAuthorizationCode() {
    return this.authorizationCode;
  }

  public getCodeChallenge() {
    return this.codeChallenge;
  }

  public isExpired() {
    return this.expiresAt.getTime() < Date.now();
  }

  public markCodeAsExchanged(grant: OAuthGrant) {
    if (this.grant != null) {
      throw new Error("The code is already exchanged.");
    }
    this.grant = grant;
  }

  public getGrant() {
    return this.grant;
  }

}