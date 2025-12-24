import { OAuthGrant } from "../entity/OAuthGrant.js";

export class OAuthGrantRepository {

  private static instance: OAuthGrantRepository;

  public static getInstance() {
    if (this.instance == null) {
      this.instance = new OAuthGrantRepository();
    }
    return this.instance;
  }

  private idIndex = new Map<string, OAuthGrant>();
  private userAndClientIndex = new Map<string, OAuthGrant>();

  constructor() {
    this.idIndex = new Map<string, OAuthGrant>();
    this.userAndClientIndex = new Map<string, OAuthGrant>();
  }

  public save(grant: OAuthGrant) {
    const userAndClientKey = this.getUserAndClientKey(grant);
    const existingGrant = this.userAndClientIndex.get(userAndClientKey);
    if (existingGrant != null) {
      this.delete(existingGrant);
    }

    this.idIndex.set(grant.getId(), grant);
    this.userAndClientIndex.set(userAndClientKey, grant);
  }

  public findById(id: string) {
    return this.idIndex.get(id);
  }

  public delete(grant: OAuthGrant) {
    const userAndClientKey = this.getUserAndClientKey(grant);
    this.idIndex.delete(grant.getId());
    this.userAndClientIndex.delete(userAndClientKey);
  }

  private getUserAndClientKey(grant: OAuthGrant) {
    return grant.getClientId() + "_" + grant.getUserId();
  }
}