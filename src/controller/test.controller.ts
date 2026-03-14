import {
  controller,
  httpPost,
  request,
  response,
} from "inversify-express-utils";
import type { interfaces } from "inversify-express-utils";
import type { Request, Response } from "express";
import { z } from "zod";

import { validateBody } from "@/middleware/schema-validation-middleware";
import { authMiddleware } from "@/middleware/auth-middleware";

const helloSchema = z.object({
  name: z.string().min(1),
});

@controller("/api/test")
export class TestController implements interfaces.Controller {
  @httpPost("/hello", authMiddleware, validateBody(helloSchema))
  private async hello(@request() req: Request, @response() res: Response) {
    const { name } = req.body as z.infer<typeof helloSchema>;
    const { role } = req.user!;

    res.json({
      message: `hello world ${name} with role ${role}`,
    });
  }
}
