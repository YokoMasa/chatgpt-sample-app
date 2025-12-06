import { OAuthGrant } from "../entity/OAuthGrant.js";

export class OAuthGrantRepository {

  private static instance: OAuthGrantRepository;

  public static getInstance() {
    if (this.instance == null) {
      this.instance = new OAuthGrantRepository();
    }
    return this.instance;
  }

  private index: Map<string, Map<string, OAuthGrant>>;
  private codeIndex: Map<string, OAuthGrant>;

  constructor() {
    this.index = new Map<string, Map<string, OAuthGrant>>();
    this.codeIndex = new Map<string, OAuthGrant>();
  }

  public save(grant: OAuthGrant) {
    let innerMap = this.index.get(grant.getUserId());
    if (innerMap == null) {
      innerMap = new Map<string, OAuthGrant>();
      this.index.set(grant.getUserId(), innerMap);
    }
    innerMap.set(grant.getClientId(), grant);

    this.codeIndex.set(grant.getAuthorizationCode(), grant);
  }

  public findByUserIdAndClientId(userId: string, clientId: string) {
    const innerMap = this.index.get(userId);
    if (innerMap != null) {
      return innerMap.get(clientId);
    }
    return undefined;
  }

  public findByAuthorizationCode(code: string) {
    return this.codeIndex.get(code);
  }

  public delete(grant: OAuthGrant) {
    const innerMap = this.index.get(grant.getUserId());
    if (innerMap != null) {
      innerMap.delete(grant.getClientId());
    }
    this.codeIndex.delete(grant.getAuthorizationCode());
  }
}