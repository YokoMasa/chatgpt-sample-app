import { randomUUID } from "crypto";
import { Scope } from "../vo/Scope.js";
import type { OAuthSession } from "./OAuthSession.js";

const fourHoursMillis = 1000 * 60 * 60 * 4;

export class OAuthGrant {
  private id: string;
  private clientId: string;
  private userId: string;
  private expiresAt: Date;
  private scopes: Scope[];

  constructor({
    clientId,
    userId,
    scopes
  }: {
    clientId: string;
    userId: string;
    scopes: Scope[];
  }) {
    this.id = randomUUID();
    this.clientId = clientId;
    this.userId = userId;
    this.expiresAt = new Date(Date.now() + fourHoursMillis);
    this.scopes = scopes;
  }

  public static fromSession(session: OAuthSession) {
    return new OAuthGrant({
      clientId: session.getClientId(),
      userId: session.getUserId(),
      scopes: session.getRequestedScopes()
    });
  }

  public getId() {
    return this.id;
  }

  public getClientId() {
    return this.clientId;
  }

  public getUserId() {
    return this.userId;
  }

  public getScopes() {
    return this.scopes.values();
  }

  public hasScope(scope: Scope) {
    return this.scopes.some(s => s === scope);
  }

  public isExpired() {
    return this.expiresAt.getTime() < Date.now();
  }

}