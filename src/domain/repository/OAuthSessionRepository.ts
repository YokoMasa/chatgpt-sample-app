import { OAuthSession } from "../entity/OAuthSession.js";

export class OAuthSessionRepository {
  private static instance: OAuthSessionRepository;

  public static getInstance() {
    if (this.instance == null) {
      this.instance = new OAuthSessionRepository();
    }
    return this.instance;
  }

  private indexByCode: Map<string, OAuthSession>;

  constructor() {
    this.indexByCode = new Map<string, OAuthSession>();
  }

  public save(session: OAuthSession) {
    const existing = this.indexByCode.get(session.getAuthorizationCode());
    if (existing == null) {
      this.indexByCode.set(session.getAuthorizationCode(), session);
    } else if (existing !== session) {
      console.error("authorization_code collided!")
      throw new Error("Unexpected error occurred.");
    }
  }

  public findByCode(code: string) {
    return this.indexByCode.get(code);
  }

  public delete(session: OAuthSession) {
    this.indexByCode.delete(session.getAuthorizationCode());
  }

}