import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { InversifyExpressServer } from "inversify-express-utils";
import cors from "cors";
import { container } from "./di/inversify.config";

// Controllers
import "./controller/auth.controller";
import "./controller/test.controller";
import "./controller/books.controllers";

import type { ConfigService } from "./service/config-service.interface";
import { TYPES } from "./di/types";

const server = new InversifyExpressServer(container);

server.setConfig((app) => {
  app.use(express.json());
  app.use(cors());
});

server.setErrorConfig((app) => {
  // Catch-all handler for invalid routes
  app.use((req: Request, res: Response, next: NextFunction) => {
    const error = Object.assign(
      new Error(`Cannot find ${req.originalUrl} on this server`),
      { status: 404 },
    );
    next(error);
  });

  // Global error handler
  app.use(
    (
      err: Error & { status: number; isOperational?: boolean },
      req: Request,
      res: Response,
      // eslint-disable-next-line
      next: NextFunction,
    ) => {
      const configService = container.get<ConfigService>(TYPES.ConfigService);
      const isDev = configService.get("NODE_ENV") === "development";
      const statusCode = err.status || 500;

      if (!err.isOperational) {
        console.error("Unexpected error occurred:", err);
      }

      res.status(statusCode).json({
        status: "error",
        message: err.isOperational ? err.message : "Something went wrong",
        ...(isDev && { stack: err.stack }),
      });
    },
  );
});

export const app = server.build();
