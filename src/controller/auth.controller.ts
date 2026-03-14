import {
  controller,
  httpPost,
  request,
  response,
} from "inversify-express-utils";
import { inject } from "inversify";
import { TYPES } from "@/di/types";

import type { interfaces } from "inversify-express-utils";
import type { Request, Response } from "express";
import type { AuthService } from "@/service/auth-service.interface";
import { validateBody } from "@/middleware/schema-validation-middleware";
import { loginSchema, registerSchema } from "@/dto/zod/auth-service.zod";

@controller("/api/auth")
export class AuthController implements interfaces.Controller {
  constructor(@inject(TYPES.AuthService) private authService: AuthService) {}

  @httpPost("/register", validateBody(registerSchema))
  private async register(@request() req: Request, @response() res: Response) {
    const result = await this.authService.register(req.body);
    res.json({
      token: result.token,
    });
  }

  @httpPost("/login", validateBody(loginSchema))
  private async login(@request() req: Request, @response() res: Response) {
    const result = await this.authService.login(req.body);
    res.json({
      token: result.token,
    });
  }
}
