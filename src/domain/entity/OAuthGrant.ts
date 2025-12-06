import { getRandomValues } from "crypto";
import type { PKCEVerifier } from "../../utils/PKCEVerifier.js";
import { Scope } from "../vo/Scope.js";
import type { OAuthClient } from "./OAuthClient.js";

const tenMinutesMillis = 1000 * 60 * 10;

export class OAuthGrant {
  private clientId: string;
  private userId: string;
  private createdAt: Date;
  private authorizationCode: string;
  private authorizationCodeExchanged: boolean;
  private codeChallenge: string;
  private scopes: Scope[];

  constructor({
    clientId,
    userId,
    codeChallenge,
    scopes
  }: {
    clientId: string;
    userId: string;
    codeChallenge: string;
    scopes: Scope[];
  }) {
    this.clientId = clientId;
    this.userId = userId;
    this.createdAt = new Date();
    this.authorizationCodeExchanged = false;
    this.codeChallenge = codeChallenge;
    this.scopes = scopes;

    const randomBytes = Buffer.alloc(96);
    getRandomValues(randomBytes);
    this.authorizationCode = randomBytes.toString("base64url").replace(/=/g, "");
  }

  public static createNew({
    client,
    userId,
    codeChallenge,
    scopes
  }: {
    client: OAuthClient;
    userId: string;
    codeChallenge: string;
    scopes?: Scope[];
  }): OAuthGrant {
    return new OAuthGrant({
      clientId: client.getId(),
      userId,
      codeChallenge,
      scopes: scopes ?? [Scope.MCP_DEFAULT]
    });
  }

  public getClientId() {
    return this.clientId;
  }

  public getUserId() {
    return this.userId;
  }

  public getAuthorizationCode() {
    return this.authorizationCode;
  }

  public getCodeChallenge() {
    return this.codeChallenge;
  }

  public getScopes() {
    return this.scopes.values();
  }

  public isCodeAlreadyExchanged() {
    return this.authorizationCodeExchanged;
  }

  public isCodeExpired() {
    // https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1-13#name-authorization-response
    return (this.createdAt.getTime() + tenMinutesMillis) < Date.now();
  }

  public markCodeAsExchanged() {
    if (this.authorizationCodeExchanged) {
      throw new Error("The code is already marked as exchanged! Something is wrong.");
    }
    this.authorizationCodeExchanged = true;
  }
  
}