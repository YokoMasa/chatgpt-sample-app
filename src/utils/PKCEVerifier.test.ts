import { describe, expect, it } from "vitest";
import { PKCEVerifier } from "./PKCEVerifier.js";

describe(PKCEVerifier, () => {
  describe("plain", () => {
    it("With correct code verifier, returns isSuccess: true", () => {
      const verifier = PKCEVerifier.plain("1234567890abcdefghijklmnopqrstuvwxyz-_~.ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz-_~.ABCDEFGHIJKLMNOPQRSTUV");
      expect(verifier.verify("1234567890abcdefghijklmnopqrstuvwxyz-_~.ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz-_~.ABCDEFGHIJKLMNOPQRSTUV").isSuccess).toBe(true);
    });

    it ("With code verifier including invalid letter, returns isSuccess: false", () => {
      const verifier = PKCEVerifier.plain("1234567890abcdefghijklmnopqrstuvwxyz-_~.ABCDEFGHIJKLMNOPQRSTUVWXYZ/");
      expect(verifier.verify("1234567890abcdefghijklmnopqrstuvwxyz-_~.ABCDEFGHIJKLMNOPQRSTUVWXYZ/").isSuccess).toBe(false);
    });

    it ("With code verifier including too few letters, returns isSuccess: false", () => {
      const verifier = PKCEVerifier.plain("1234567890abcdefghijklmnopqrstuvwxyz-_~.AB");
      expect(verifier.verify("1234567890abcdefghijklmnopqrstuvwxyz-_~.AB").isSuccess).toBe(false);
    });

    it ("With code verifier including too many letters, returns isSuccess: false", () => {
      const verifier = PKCEVerifier.plain("1234567890abcdefghijklmnopqrstuvwxyz-_~.ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz-_~.ABCDEFGHIJKLMNOPQRSTUVW");
      expect(verifier.verify("1234567890abcdefghijklmnopqrstuvwxyz-_~.ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz-_~.ABCDEFGHIJKLMNOPQRSTUVW").isSuccess).toBe(false);
    });
  });

  describe("s256", () => {
    it("With correct code verifier, returns isSuccess: true", () => {
      // generated with https://developer.pingidentity.com/en/tools/pkce-code-generator.html
      const verifier = PKCEVerifier.s256("lS2TJK3UY3pqqOVUkuFwwn4-Qygl7mkwwYk0Te8XNcU");
      expect(verifier.verify("vrtWBQPe3AUo-6HJGa7IWQKj8XxBNG9DpY6aioDbcpcyilwPbx_xapHv7vd7H7qpHN6nsP9YxXOynvwJpNW-Wpzis0XXfdoGUmN9o1YGrmsRhoadIfOweHpkYVOZjyR-").isSuccess).toBe(true);
    });
  });
});