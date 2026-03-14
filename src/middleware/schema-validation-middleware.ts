import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";
import { ZodError } from "zod";
import { BadRequestError } from "@/errors";

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      console.error("Validation error occurred", error);

      if (error instanceof ZodError) {
        return next(new BadRequestError("Invalid request body"));
      }

      next(error);
    }
  };
}
