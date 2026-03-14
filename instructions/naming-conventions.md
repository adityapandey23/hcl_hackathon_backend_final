# Naming Conventions

Define clear naming and structural conventions so another LLM can safely add features to this backend without breaking patterns.

## General principles

1. **Be consistent with existing code**: When unsure, copy the style used for `user`, `AuthService`, `AuthController`, and `UserRepositoryImpl`.
2. **Use descriptive names**: Names should describe intent (e.g. `SessionRepository`, `CreateSessionDto`, `sessionSchema`).
3. **Prefer singular domain names**: Both table and model names are singular (`user`, not `users`).

---

## Files and directories

- **Controllers**: `src/controller/<domain>.controller.ts`
  - Example: `AuthController` → `auth.controller.ts`.

- **Services**
  - Interface: `src/service/<domain>-service.interface.ts`
    - Example: `AuthService` → `auth-service.interface.ts`.
  - Implementation: `src/service/impl/<domain>-service.impl.ts`
    - Example: `AuthServiceImpl` → `auth-service.impl.ts`.

- **Repositories**
  - Interface: `src/repository/<domain>-repository.interface.ts`
    - Example: `UserRepository` → `user-repository.interface.ts`.
  - Implementation: `src/repository/impl/<domain>-repository.impl.ts`
    - Example: `UserRepositoryImpl` → `user-repository.impl.ts`.

- **DTOs**
  - Service DTOs: `src/dto/<domain>-service.dto.ts`
    - Example: `auth-service.dto.ts` with `LoginDto`, `RegisterDto`, `TokenPayload`.
  - Zod schemas: `src/dto/zod/<domain>-service.zod.ts`
    - Example: `auth-service.zod.ts` with `loginSchema`, `registerSchema`.

- **Database**
  - Schema: `src/db/schema.ts` (all tables in one file).
  - DB bootstrap & types: `src/db/index.ts`.

- **Models / DB types**
  - `src/model/index.ts` exports typed views of tables:
    - `User`, `NewUser`, `Session`, `NewSession`, etc.

- **Middleware**
  - Generic middleware: `src/middleware/<feature>-middleware.ts`
    - Example: `auth-middleware.ts`, `schema-validation-middleware.ts`.

- **Dependency Injection**
  - DI container: `src/di/inversify.config.ts`.
  - Token enum: `src/di/types.ts`.

---

## TypeScript naming

- **Types and interfaces**
  - Use **PascalCase**.
  - Examples:
    - `AuthService`, `AuthServiceImpl`
    - `UserRepository`, `UserRepositoryImpl`
    - `LoginDto`, `RegisterDto`, `TokenPayload`
    - `JwtService`, `JwtPayload`
    - `User`, `NewUser`, `Session`, `NewSession`

- **Functions and methods**
  - Use **camelCase** (e.g. `findByEmail`, `signToken`, `verifyToken`).

- **Variables and parameters**
  - Use **camelCase** (e.g. `existingUser`, `hashedPassword`, `configService`).

- **Constants**
  - Use **UPPER_SNAKE_CASE** only for true constants or environment-like tokens.
  - DI tokens are grouped under `TYPES` (e.g. `TYPES.AuthService`, `TYPES.UserRepository`).

---

## Database naming (Drizzle schema)

Use the existing `user` table in `src/db/schema.ts` as the canonical pattern.

- **Tables**
  - Exported constant name: **camelCase singular**.
    - Example: `export const user = pgTable("user", { ... });`
  - Actual SQL table name (first argument to `pgTable`): **snake_case singular** or simple lower-case singular.
    - Current pattern: `"user"`.

- **Columns**
  - Use **snake_case** column names.
  - Common columns are provided by `commonColumns()`:
    - `id`
    - `created_at` → property `createdAt`
    - `updated_at` → property `updatedAt`
  - Domain-specific columns:
    - Example:
      - `name: text("name").notNull()`
      - `email: text("email").notNull().unique()`
      - `password: text("password").notNull()`

- **Common columns helper**
  - Always spread `commonColumns()` at the top of each table definition:
    - `...commonColumns(),`

---

## Model / type naming for DB entities

In `src/model/index.ts`, follow this pattern for every table:

- **Select type** (row fetched from DB): `<Entity>`
  - Example: `export type User = typeof user.$inferSelect;`
- **Insert type** (row to be inserted): `New<Entity>`
  - Example: `export type NewUser = typeof user.$inferInsert;`

For a new table `session`, you should have:

- `export type Session = typeof session.$inferSelect;`
- `export type NewSession = typeof session.$inferInsert;`

---

## DTO and validation naming

Use `src/dto/auth-service.dto.ts` and `src/dto/zod/auth-service.zod.ts` as templates.

- **DTOs (`src/dto/<domain>-service.dto.ts`)**
  - Input DTOs: `<Verb><Entity>Dto` or `<Action>Dto`
    - Examples: `LoginDto`, `RegisterDto`.
  - Output DTOs / payloads: `<Name>Payload`, `<Name>Response`, etc.
    - Example: `TokenPayload`.

- **Zod schemas (`src/dto/zod/<domain>-service.zod.ts`)**
  - Use `<lowerCamel>Schema` names tied to DTOs.
  - Examples:
    - `loginSchema`
    - `registerSchema`

Match Zod schemas to the corresponding DTO fields whenever possible.

---

## Controller naming and routing

Use `src/controller/auth.controller.ts` as the pattern.

- **Class name**
  - `<Domain>Controller` in **PascalCase**.
  - Example: `AuthController`.

- **Base path decorator**
  - `@controller("/api/<domain>")`.
  - Example: `@controller("/api/auth")`.

- **Method decorators**
  - Use HTTP verb decorators from `inversify-express-utils`:
    - `@httpGet`, `@httpPost`, `@httpPut`, `@httpPatch`, `@httpDelete`.
  - Method names: **camelCase** verbs that describe the operation:
    - `register`, `login`, `createFoo`, `getFoo`, `updateFoo`, `deleteFoo`, etc.

- **Middleware**
  - Validation middleware: `validateBody(<schema>)` for body validation.
  - Auth middleware (if needed): `authMiddleware` for JWT-protected routes.

---

## Service and repository naming

- **Services**
  - Interface: `<Domain>Service` (e.g. `AuthService`).
  - Implementation: `<Domain>ServiceImpl` (e.g. `AuthServiceImpl`).
  - File names:
    - Interface: `src/service/<domain>-service.interface.ts`.
    - Implementation: `src/service/impl/<domain>-service.impl.ts`.

- **Repositories**
  - Interface: `<Entity>Repository` (e.g. `UserRepository`).
  - Implementation: `<Entity>RepositoryImpl` (e.g. `UserRepositoryImpl`).
  - File names:
    - Interface: `src/repository/<entity>-repository.interface.ts`.
    - Implementation: `src/repository/impl/<entity>-repository.impl.ts`.

- **Methods**
  - CRUD:
    - `create`, `findById`, `update`, `delete`.
  - Additional queries:
    - `findByEmail`, `findByUserIdAndStatus`, etc., using `findBy<Something>` naming.

---

## Dependency injection tokens (Inversify)

Follow `src/di/types.ts` and `inversify.config.ts` patterns.

- **Token naming**
  - Use `TYPES.<Name>` in PascalCase matching the service or repository interface.
  - Examples:
    - `TYPES.AuthService`
    - `TYPES.ConfigService`
    - `TYPES.JwtService`
    - `TYPES.UserRepository`
    - `TYPES.Database`

- **Binding naming**
  - `container.bind<Interface>(TYPES.InterfaceName).to(ImplementationClass);`
  - For DB:
    - `container.bind<NodePgDatabase>(TYPES.Database).toConstantValue(db);`

---

## Error and response naming

- **Errors**
  - Use existing error types from `src/errors/index.ts` (e.g. `UnauthorizedError`, `ConflictError`, `InternalError`, `DatabaseError`).
  - Name new domain-specific errors `<Domain><ErrorType>` only if truly necessary.

- **Responses**
  - For controllers, respond with JSON objects whose shape is clear and minimal.
  - Example from `AuthController`:
    - `{ token: result.token }`

Maintain this simplicity for new routes unless there is a strong reason to return nested objects.

---

## When an LLM is unsure

If a naming decision is ambiguous:

1. Prefer matching the most similar existing feature (`auth`, `user`, `session`).
2. Prefer singular nouns for entities and pluralization only for collections in responses (e.g. `items` array).
3. Prefer longer, more descriptive names over short, cryptic ones.
