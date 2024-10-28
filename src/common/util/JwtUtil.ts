import * as jwt from "jsonwebtoken";
import { env } from "@config/env";
import { logger } from "@util/logger";
import { AuthenticationException } from "@exception/AuthenticationException";
import { ServerErrorException } from "@exception/ServerErrorException";

export interface JwtPayload extends jwt.JwtPayload {
  userEmail: string;
}

export class JwtUtil {
  public constructor() {
    logger.info("JwtUtil initialized");
  }
  async verifyAccessToken(token: string) {
    return await this.verifyJwt(token, env.ACCESS_TOKEN_SECRET);
  }

  async generateAccessToken(userEmail: string) {
    return await this.createJwt(
      userEmail,
      { userEmail },
      env.ACCESS_TOKEN_SECRET,
      env.ACCESS_TOKEN_EXPIRES_IN
    );
  }

  private async createJwt(
    aud: string,
    payload: JwtPayload,
    secret: jwt.Secret,
    expiresIn: number
  ): Promise<string> {
    try {
      const options = {
        expiresIn: Math.floor(Date.now() / 1000) + expiresIn,
        issuer: env.API_DOMAIN,
        audience: aud,
      };

      return jwt.sign(payload, secret, options);
    } catch (error) {
      throw new ServerErrorException("Error in signing token!");
    }
  }

  private async verifyJwt(
    token: string,
    secret: jwt.Secret
  ): Promise<JwtPayload> {
    try {
      const payload = jwt.verify(token, secret) as JwtPayload;
      return payload;
    } catch (error) {
      throw new AuthenticationException("Invalid access token");
    }
  }
}
