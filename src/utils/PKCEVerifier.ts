import { createHash } from "crypto";

type Transformation = "S256" | "plain";

export type PKCEVerificationResult = {
  isSuccess: true;
} | {
  isSuccess: false;
  errorMessage: string;
}

/**
 * https://datatracker.ietf.org/doc/html/rfc7636
 */
export class PKCEVerifier {
  
  private codeChallenge: string;
  private transformation: Transformation;

  constructor(codeChallenge: string, transformation: Transformation) {
    this.codeChallenge = codeChallenge;
    this.transformation = transformation;
  }

  public static s256(codeChallenge: string) {
    return new PKCEVerifier(codeChallenge, "S256");
  }

  public static plain(codeChallenge: string) {
    return new PKCEVerifier(codeChallenge, "plain");
  }

  public verify(codeVerifier: string): PKCEVerificationResult {
    if (codeVerifier.length < 43 || 128 < codeVerifier.length) {
      return {
        isSuccess: false,
        errorMessage: "codeVerifier's length must be between 43 ~ 128."
      };
    }

    for (let i = 0; i < codeVerifier.length; i++) {
      const codepoint = codeVerifier.codePointAt(i) as number;
      if (
        !(48 <= codepoint && codepoint <= 57) // 0-9
        && !(65 <= codepoint && codepoint <= 90) // A-Z
        && !(97 <= codepoint && codepoint <= 122) // a-z
        && codepoint !== 45 // -
        && codepoint !== 46 // .
        && codepoint !== 95 // _
        && codepoint !== 126 // ~
      ) {
        return {
          isSuccess: false,
          errorMessage: "invalid letter in codeVerifier."
        };
      }
    }

    const calculatedCodeChallenge = this.calculateCodeChallenge(codeVerifier);
    if (this.codeChallenge === calculatedCodeChallenge) {
      return {
        isSuccess: true
      }
    } else {
      return {
        isSuccess: false,
        errorMessage: "verification failed."
      }
    }
  }

  private calculateCodeChallenge(codeVerifier: string): string {
    if (this.transformation === "plain") {
      return codeVerifier;
    }

    const sha256 = createHash("sha256");
    sha256.update(codeVerifier, "ascii");
    const base64Encoded = sha256.digest().toString("base64url");
    return base64Encoded
      .replaceAll(/\+/g, "-")
      .replaceAll(/\//g, "_")
      .replaceAll(/=/g, "");

  }

}