const port = process.env.PORT ?? "3000";
const host = process.env.HOST ?? "localhost";
const sessionSecret = process.env.SESSION_SECRET ?? "847be5d131ce43bddce25bc4144e2e52";
const accessTokenHmacSecret = process.env.ACCESS_TOKEN_HMAC_SECRET ?? "add747e4f454abf948a93bb28af61d96";
const baseUrl = process.env.BASE_URL ?? "https://chatgpt-sample-app-481008.an.r.appspot.com";
const isProd = process.env.NODE_ENV === "production";

export const ENV = {
  port,
  host,
  sessionSecret,
  accessTokenHmacSecret,
  baseUrl,
  isProd
} as const;