import { ENV } from "./utils/Env.js";
import { AccessTokenService } from "./auth/AccessTokenService.js";
import { OAuthClientStore } from "./auth/OAuthClientStore.js";
import { OAuthService } from "./auth/OAuthService.js";
import { OAuthClientRepository } from "./domain/repository/OAuthClientRepository.js";
import { OAuthGrantRepository } from "./domain/repository/OAuthGrantRepository.js";
import { OAuthSessionRepository } from "./domain/repository/OAuthSessionRepository.js";
import { OAuthClient } from "./domain/entity/OAuthClient.js";
import { OAuthGrant } from "./domain/entity/OAuthGrant.js";
import { OAuthSession } from "./domain/entity/OAuthSession.js";
import { Scope } from "./domain/vo/Scope.js";

OAuthClientStore.init(OAuthClientRepository.getInstance());
AccessTokenService.init(ENV.accessTokenHmacSecret);
OAuthService.init(
  AccessTokenService.getInstance(),
  OAuthClientRepository.getInstance(),
  OAuthSessionRepository.getInstance(),
  OAuthGrantRepository.getInstance(),
  OAuthClientStore.getInstance()
);

if (!ENV.isProd) {
  const testClient = OAuthClient.from({
    redirect_uris: ["http://localhost:11111/test/callback"]
  });
  OAuthClientRepository.getInstance().save(testClient);

  const testSession = new OAuthSession({
    client: testClient,
    userId: "TEST1111",
    requestedScopes: [Scope.MCP_DEFAULT],
    codeChallenge: "CODE_CHALLENGE"
  });
  OAuthSessionRepository.getInstance().save(testSession);

  const testGrant = OAuthGrant.fromSession(testSession);
  OAuthGrantRepository.getInstance().save(testGrant);

  const token = AccessTokenService.getInstance().createToken(testGrant);
  console.log("TEST TOKEN: ", token);
}