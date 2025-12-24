import { OAuthClient } from "../entity/OAuthClient.js";

export class OAuthClientRepository {

  private static instance: OAuthClientRepository;

  public static getInstance(): OAuthClientRepository {
    if (this.instance == null) {
      this.instance = new OAuthClientRepository();
    }
    return this.instance;
  }

  private index: Map<string, OAuthClient>;

  constructor() {
    this.index = new Map<string, OAuthClient>();
  }

  public save(client: OAuthClient) {
    this.index.set(client.getId(), client);
  }

  public findById(id: string) {
    return this.index.get(id);
  }
  
}