import type { Role } from "@/db/schema";

export interface JwtPayload {
  sub: string;
  role: Role;
  iat?: number;
  exp?: number;
}
