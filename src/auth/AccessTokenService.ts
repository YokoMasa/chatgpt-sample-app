import * as jwt from "jsonwebtoken";
import type { OAuthGrant } from "../domain/entity/OAuthGrant.js";

export type AccessTokenPayload = {
  grantId: string;
  userId: string;
}

export type AccessTokenVerificationResult = {
  isSuccess: false;
} | {
  isSuccess: true;
  payload: AccessTokenPayload;
}

export class AccessTokenService {

  private static instance: AccessTokenService;

  public static init(hmacSecret: string) {
    if (this.instance == null) {
      this.instance = new AccessTokenService(hmacSecret);
    }
  }

  public static getInstance() {
    if (this.instance == null) {
      throw new Error("Call init() first!");
    }
    return this.instance;
  }

  private hmacSecret: string;

  private constructor(hmacSecret: string) {
    this.hmacSecret = hmacSecret;
  }

  public createToken(grant: OAuthGrant): string {
    return jwt.sign(
      {
        grantId: grant.getId()
      },
      this.hmacSecret,
      {
        algorithm: "HS256",
        expiresIn: "4h",
        audience: "https://test.com", // TODO: RS domain,
        issuer: "https://test.com", // TODO: AS domain
        subject: grant.getUserId()
      }
    );
  }

  public verifyToken(token: string): AccessTokenVerificationResult {
    try {
      const payload = jwt.verify(token, this.hmacSecret, {
        algorithms: ["HS256"],
        issuer: "https://test.com",
        audience: "https://test.com"
      });
      if (typeof payload !== "object") {
        throw new Error("payload is not an object!");
      }
      const grantId = payload.grantId;
      const userId = payload.sub;
      if (grantId == null || userId == null) {
        throw new Error("malformed payload!");
      }

      return {
        isSuccess: true,
        payload: {
          grantId,
          userId
        }
      }
    } catch (e) {
      return {
        isSuccess: false
      }
    }
  }

}