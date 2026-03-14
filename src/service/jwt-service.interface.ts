import type { JwtPayload } from "@/dto/jwt-service.dto";

export interface JwtService {
  signToken(payload: JwtPayload): Promise<string>;
  verifyToken(token: string): Promise<JwtPayload>;
}
