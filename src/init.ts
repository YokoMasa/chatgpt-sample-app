import { ENV } from "./utils/Env.js";
import { AccessTokenService } from "./auth/AccessTokenService.js";
import { OAuthClientStore } from "./auth/OAuthClientStore.js";
import { OAuthService } from "./auth/OAuthService.js";
import { OAuthClientRepository } from "./domain/repository/OAuthClientRepository.js";
import { OAuthGrantRepository } from "./domain/repository/OAuthGrantRepository.js";
import { OAuthSessionRepository } from "./domain/repository/OAuthSessionRepository.js";

OAuthClientStore.init(OAuthClientRepository.getInstance());
AccessTokenService.init(ENV.accessTokenHmacSecret);
OAuthService.init(
  AccessTokenService.getInstance(),
  OAuthClientRepository.getInstance(),
  OAuthSessionRepository.getInstance(),
  OAuthGrantRepository.getInstance(),
  OAuthClientStore.getInstance()
);