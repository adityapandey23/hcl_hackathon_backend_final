import type { JwtPayload } from "@/dto/jwt-service.dto";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      userId: JwtPayload["sub"];
    };
  }
}
