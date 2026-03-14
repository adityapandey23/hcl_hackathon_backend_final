import { z } from "zod";

import type { loginSchema, registerSchema } from "./zod/auth-service.zod";

export type LoginDto = z.infer<typeof loginSchema>;
export type RegisterDto = z.infer<typeof registerSchema>;
export interface TokenPayload {
  token: string;
}
