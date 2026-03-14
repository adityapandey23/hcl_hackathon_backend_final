# Adding a new route

Provide a step-by-step recipe so an LLM can add a new HTTP route (controller + service + validation + DI) consistent with the existing `AuthController` pattern.

---

## 1. Clarify the feature

1. **Identify the domain** (e.g. `session`, `profile`, `task`).
2. **Decide the base route**:
   - Prefer `/api/<domain>` (e.g. `/api/auth`, `/api/session`).
3. **Decide HTTP method and sub-path**:
   - Examples: `POST /api/session`, `GET /api/session/:id`, `PATCH /api/profile`.
4. **Define input and output shape** in plain language before writing code.

---

## 2. Create or update DTOs

Location: `src/dto/<domain>-service.dto.ts`

1. **If the file does not exist**, create it.
   - Example filename for `session`: `src/dto/session-service.dto.ts`.
2. **Define DTO types**:
   - For request body: `<Action>Dto` or `<Verb><Entity>Dto`.
   - For response: `<Name>Payload` or `<Name>Response`.
3. **Follow the style of `auth-service.dto.ts`**:
   - Use TypeScript `type` or `interface`.
   - Use clear, descriptive property names.

Example (pseudo-structure only, do not copy blindly):

```typescript
export type CreateSessionDto = {
  userId: string;
  expiresAt: Date;
};

export type SessionPayload = {
  id: string;
};
```

---

## 3. Add request validation with Zod

Location: `src/dto/zod/<domain>-service.zod.ts`

1. **If the file does not exist**, create it.
   - Example for `session`: `src/dto/zod/session-service.zod.ts`.
2. **Import `z` from `"zod"`**.
3. **Create schemas matching DTOs**:
   - Use `<lowerCamel>Schema` names (e.g. `createSessionSchema`).
   - Mirror the DTO structure as closely as possible.
4. **Use the same style as `auth-service.zod.ts`**:
   - `z.string().email()`, `.min(1)`, `.min(8)`, etc.

---

## 4. Define or extend the service interface

Location: `src/service/<domain>-service.interface.ts`

1. **If the file does not exist**, create it (mirror `auth-service.interface.ts`).
2. **Export a `<Domain>Service` interface** with methods for each operation.
   - Example signatures:
     - `create(dto: CreateSessionDto): Promise<SessionPayload>;`
     - `getById(id: string): Promise<SessionPayload>;`
3. Ensure method names are **camelCase** verbs (`createSession`, `getSessionById`, etc.) or concise domain verbs.

---

## 5. Implement the service

Location: `src/service/impl/<domain>-service.impl.ts`

1. **Create `<Domain>ServiceImpl` class** similar to `AuthServiceImpl`.
2. **Annotate with `@injectable()`** (from `inversify`).
3. **Inject dependencies** using `@inject(TYPES.<Dependency>)`:
   - Typically one or more repositories and `JwtService` (if authentication-related).
4. **Implement interface methods**:
   - Perform validation and domain logic.
   - Call repositories as needed.
   - Throw domain-specific errors using `src/errors` types.
   - Return the DTOs/payloads defined earlier.

Use `AuthServiceImpl` as a style and error-handling reference.

---

## 6. Add or extend a repository if needed

If your route interacts with the database:

1. **Add repository interface** if it does not exist:
   - Location: `src/repository/<entity>-repository.interface.ts`.
2. **Add repository implementation** following `UserRepositoryImpl`:
   - Location: `src/repository/impl/<entity>-repository.impl.ts`.
   - Use Drizzle with `DbOrTransaction` from `src/db`.
   - Reuse patterns like `create`, `findById`, `update`, `delete`, plus custom methods (`findByEmail`, etc.).

If the repository already exists, **only extend it with the required methods**.

---

## 7. Wire up DI bindings

Location: `src/di/types.ts` and `src/di/inversify.config.ts`

1. **Add a new DI token** in `types.ts` (if needed):
   - Pattern: `AuthService` → `TYPES.AuthService`.
   - Do the same for your new `FooService` or `FooRepository`.
2. **Bind the implementation in `inversify.config.ts`**:
   - Services:
     - `container.bind<FooService>(TYPES.FooService).to(FooServiceImpl);`
   - Repositories:
     - `container.bind<FooRepository>(TYPES.FooRepository).to(FooRepositoryImpl);`

Follow the exact style used for `AuthServiceImpl` and `UserRepositoryImpl`.

---

## 8. Create or extend a controller

Location: `src/controller/<domain>.controller.ts`

1. **If creating a new controller**, define a class:
   - Decorate with `@controller("/api/<domain>")`.
   - Implement `interfaces.Controller` (from `inversify-express-utils`).
2. **Inject the service** via constructor:
   - Example:
     - `constructor(@inject(TYPES.FooService) private fooService: FooService) {}`
3. **Add methods with HTTP decorators**:
   - `@httpPost("/path", middlewares...)`
   - `@httpGet("/path/:id", middlewares...)`
   - `@httpPatch(...)`, `@httpDelete(...)`, etc.
4. **Use middleware in decorator arguments**:
   - Body validation: `validateBody(createFooSchema)`
   - Auth protection (if needed): `authMiddleware`
5. **Use `@request()` and `@response()`** to access the Express `Request`/`Response`.

Use `AuthController` as the template for structure and decorator usage.

---

## 9. Register the controller in the app

Location: `src/app.ts`

1. **Import the new controller file** even if you do not reference the class directly.
   - Pattern already used:
     - `import "./controller/auth.controller";`
2. **Add a similar side-effect import** for your new controller:
   - Example:
     - `import "./controller/session.controller";`
3. No further changes are usually required; `InversifyExpressServer` discovers controllers via these imports.

---

## 10. Use auth middleware for protected routes

If the route must be authenticated:

1. **Import `authMiddleware`** from `src/middleware/auth-middleware.ts` in the controller file.
2. **Include it in the decorator** before or after validation middleware:
   - Example:
     - `@httpGet("/me", authMiddleware)`
     - `@httpPost("/", authMiddleware, validateBody(createSessionSchema))`
3. Inside the handler, `req.user.userId` will be set by `authMiddleware`:
   - Access it when you need the authenticated user’s ID.

---

## 11. Error handling expectations

1. **Throw typed errors** from `src/errors` (e.g. `UnauthorizedError`, `ConflictError`, `InternalError`, `DatabaseError`).
2. **Do not handle generic errors in controllers**:
   - Let them bubble up to the global error handler set up in `app.ts`.
3. The global error handler will:
   - Use `status` from the error if present, otherwise `500`.
   - Log unexpected (non-operational) errors.
   - Return JSON with `status`, `message`, and optional `stack` in development.

---

## 12. Final checklist for a new route

Before considering the new route complete, an LLM should verify:

1. **DTOs added/updated** in `src/dto/<domain>-service.dto.ts`.
2. **Zod schemas created** in `src/dto/zod/<domain>-service.zod.ts`.
3. **Service interface updated** in `src/service/<domain>-service.interface.ts`.
4. **Service implementation created/updated** in `src/service/impl/<domain>-service.impl.ts`.
5. **Repositories added/expanded** if DB access is required.
6. **DI tokens added** in `src/di/types.ts` and **bindings** in `src/di/inversify.config.ts`.
7. **Controller method implemented** in `src/controller/<domain>.controller.ts`.
8. **Controller file imported** in `src/app.ts`.
9. **Auth middleware applied** for protected routes.
10. **Error behavior** matches existing patterns (use shared error classes).
