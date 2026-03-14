import { inject, injectable } from "inversify";
import type { JwtPayload, JwtService } from "../jwt-service.interface";
import { TYPES } from "@/di/types";
import { jwtVerify, SignJWT, type JWTPayload } from "jose";
import type { ConfigService } from "../config-service.interface";

@injectable()
export class JwtServiceImpl implements JwtService {
  private tokenSecret: Uint8Array;
  private tokenExpiry: string;

  constructor(
    @inject(TYPES.ConfigService) private configService: ConfigService,
  ) {
    this.tokenSecret = new TextEncoder().encode(
      this.configService.get("JWT_SECRET"),
    );

    this.tokenExpiry = "90d";
  }

  async signToken(payload: JwtPayload): Promise<string> {
    return new SignJWT({ sub: payload.sub } as JWTPayload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(this.tokenExpiry)
      .setIssuer("backend")
      .setAudience("backend-api")
      .sign(this.tokenSecret);
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    const { payload } = await jwtVerify(token, this.tokenSecret, {
      issuer: "backend",
      audience: "backend-api",
    });
    return payload as unknown as JwtPayload;
  }
}
