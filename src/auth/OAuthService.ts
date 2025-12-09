import type { OAuthRegisteredClientsStore } from "@modelcontextprotocol/sdk/server/auth/clients.js";
import type { AuthorizationParams, OAuthServerProvider } from "@modelcontextprotocol/sdk/server/auth/provider.js";
import type { AuthInfo } from "@modelcontextprotocol/sdk/server/auth/types.js";
import type { OAuthClientInformationFull, OAuthTokens } from "@modelcontextprotocol/sdk/shared/auth.js";
import type { Response } from "express";
import { OAuthClientRepository } from "../domain/repository/OAuthClientRepository.js";
import { OAuthGrantRepository } from "../domain/repository/OAuthGrantRepository.js";
import { Scope } from "../domain/vo/Scope.js";
import { OAuthGrant } from "../domain/entity/OAuthGrant.js";
import { InvalidClientError, InvalidGrantError, InvalidRequestError, InvalidScopeError, InvalidTokenError, UnsupportedGrantTypeError } from "@modelcontextprotocol/sdk/server/auth/errors.js";
import { OAuthSessionRepository } from "../domain/repository/OAuthSessionRepository.js";
import { OAuthSession } from "../domain/entity/OAuthSession.js";
import type { AccessTokenService } from "./AccessTokenService.js";
import { OAuthClientStore } from "./OAuthClientStore.js";

export class OAuthService implements OAuthServerProvider {

  private static instance: OAuthService;

  public static init(
    accessTokenService: AccessTokenService,
    clientRepo: OAuthClientRepository,
    sessionRepo: OAuthSessionRepository,
    grantRepo: OAuthGrantRepository,
    clientStore: OAuthClientStore
  ) {
    if (this.instance == null) {
      this.instance = new OAuthService(accessTokenService, clientRepo, sessionRepo, grantRepo, clientStore);
    }
  }

  public static getInstance() {
    if (this.instance == null) {
      throw new Error("Call init() first!");
    }
    return this.instance;
  }

  private accessTokenService: AccessTokenService;
  private clientRepo: OAuthClientRepository;
  private sessionRepo: OAuthSessionRepository;
  private grantRepo: OAuthGrantRepository;
  private clientStore: OAuthClientStore;

  private constructor(
    accessTokenService: AccessTokenService,
    clientRepo: OAuthClientRepository,
    sessionRepo: OAuthSessionRepository,
    grantRepo: OAuthGrantRepository,
    clientStore: OAuthClientStore
  ) {
    this.clientRepo = clientRepo;
    this.sessionRepo = sessionRepo;
    this.grantRepo = grantRepo;
    this.accessTokenService = accessTokenService;
    this.clientStore = clientStore
  }

  get clientsStore(): OAuthRegisteredClientsStore {
    return this.clientStore;
  }

  public async authorize(
    { client_id }: OAuthClientInformationFull,
    params: AuthorizationParams,
    res: Response
  ) {
    const client = this.clientRepo.findById(client_id);
    if (client == null) {
      throw new InvalidClientError("Client not found.");
    }
    if (params.scopes != null && !client.hasScopes(params.scopes)) {
      throw new InvalidScopeError("Invalid scope.");
    }

    const userId = res.req.session.userId;
    if (userId == null) {
      throw new InvalidRequestError("Unauthenticated.");
    }

    const oAuthSession = new OAuthSession({
      client,
      userId,
      requestedScopes: params.scopes != null ? params.scopes.map(Scope.fromString) : [Scope.MCP_DEFAULT],
      codeChallenge: params.codeChallenge
    });
    this.sessionRepo.save(oAuthSession);

    const redirectParams = new URLSearchParams();
    redirectParams.set("code", oAuthSession.getAuthorizationCode());
    params.state != null && redirectParams.set("state", params.state);

    const redirectUrl = `${params.redirectUri}?${redirectParams.toString()}`;
    res.redirect(redirectUrl);
  }

  public async challengeForAuthorizationCode(
    { client_id }: OAuthClientInformationFull,
    authorizationCode: string
  ): Promise<string> {
    const oAuthSession = this.sessionRepo.findByCode(authorizationCode);
    if (oAuthSession == null || oAuthSession.getClientId() !== client_id) {
      throw new InvalidGrantError("Invalid grant.");
    }
    return oAuthSession.getCodeChallenge();
  }

  public async exchangeAuthorizationCode(
    { client_id }: OAuthClientInformationFull,
    authorizationCode: string,
    _codeVerifier?: string,
    _redirectUri?: string,
    _resource?: URL
  ): Promise<OAuthTokens> {
    const oAuthSession = this.sessionRepo.findByCode(authorizationCode);
    if (
      oAuthSession == null
      || oAuthSession.getClientId() !== client_id
      || oAuthSession.isExpired()
    ) {
      throw new InvalidGrantError("Invalid grant.");
    }

    // https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1-13#name-reuse-of-authorization-code
    const existingGrant = oAuthSession.getGrant();
    if (existingGrant != null) {
      this.sessionRepo.delete(oAuthSession);
      this.grantRepo.delete(existingGrant);
      throw new InvalidGrantError("This code is already used. Revoking existing token.");
    }

    const grant = OAuthGrant.fromSession(oAuthSession);
    this.grantRepo.save(grant);
    oAuthSession.markCodeAsExchanged(grant);
    this.sessionRepo.save(oAuthSession);

    return {
      access_token: this.accessTokenService.createToken(grant),
      token_type: "Bearer"
    }
  }

  public async exchangeRefreshToken(
    _client: OAuthClientInformationFull,
    _refreshToken: string,
    _scopes?: string[],
    _resource?: URL
  ): Promise<OAuthTokens> {
    throw new UnsupportedGrantTypeError("refresh_token is not supported.");
  }

  public async verifyAccessToken(token: string): Promise<AuthInfo> {
    const verificationResult = this.accessTokenService.verifyToken(token);
    if (verificationResult.isSuccess) {
      const grant = this.grantRepo.findById(verificationResult.payload.grantId);
      if (grant == null || grant.isExpired()) {
        throw new InvalidTokenError("Invalid token.");
      }

      return {
        token,
        clientId: grant.getClientId(),
        scopes: [...grant.getScopes()],
        expiresAt: grant.getExpiresAt().getTime() / 1000,
        extra: {
          userId: grant.getUserId()
        }
      }
    } else {
      throw new InvalidTokenError("Invalid token.");
    }
  }

}