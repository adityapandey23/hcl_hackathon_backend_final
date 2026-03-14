import { Container } from "inversify";
import { TYPES } from "./types";
import { db } from "@/db";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

// Service interfaces
import type { AuthService } from "@/service/auth-service.interface";
import type { ConfigService } from "@/service/config-service.interface";
import type { JwtService } from "@/service/jwt-service.interface";

// Service implementations
import { AuthServiceImpl } from "@/service/impl/auth-service.impl";
import { ConfigServiceImpl } from "@/service/impl/config-service.impl";
import { JwtServiceImpl } from "@/service/impl/jwt-service.impl";

// Repository interface
import type { UserRepository } from "@/repository/user-repository.interface";

// Repository implemenations
import { UserRepositoryImpl } from "@/repository/impl/user-repository.impl";

const container = new Container();

// Services
container.bind<AuthService>(TYPES.AuthService).to(AuthServiceImpl);
container.bind<ConfigService>(TYPES.ConfigService).to(ConfigServiceImpl);
container.bind<JwtService>(TYPES.JwtService).to(JwtServiceImpl);

// Database
container.bind<NodePgDatabase>(TYPES.Database).toConstantValue(db);

// Repositories
container.bind<UserRepository>(TYPES.UserRepository).to(UserRepositoryImpl);

export { container };
