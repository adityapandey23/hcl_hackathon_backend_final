import { container } from "@/di/inversify.config";
import { TYPES } from "@/di/types";
import { UnauthorizedError } from "@/errors";
import type { JwtService } from "@/service/jwt-service.interface";
import type { Request, Response, NextFunction } from "express";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedError("Invalid or expired token");
    }

    const token = authHeader.substring(7);

    const jwtService = container.get<JwtService>(TYPES.JwtService);

    const payload = await jwtService.verifyToken(token);

    req.user = {
      userId: payload.sub,
      role: payload.role,
    };
    next();
  } catch (error) {
    console.error("An error has occured", error);
    next(new UnauthorizedError("Invalid or expired token"));
  }
}
