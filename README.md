# Backend Overview

This is a TypeScript backend built with **Express**, **InversifyJS** (for DI), and **Drizzle ORM** (for PostgreSQL), running on **Bun**.  
It exposes REST APIs (currently auth + a test route) and uses JWT for authentication.

## Tech stack

- **Runtime**: Bun
- **Web framework**: Express + inversify-express-utils
- **Dependency injection**: Inversify
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod
- **Auth**: JWT (via `jose`) + custom middleware

---

## Project structure

High-level layout (only key folders/files listed):

- `src/`
  - `app.ts` – Express + Inversify server setup and global error handling.
  - `controller/`
    - `auth.controller.ts` – Auth endpoints (`/api/auth`).
    - `test.controller.ts` – Test endpoint (`/api/test/hello`) for "hello world" responses.
  - `service/`
    - `auth-service.interface.ts` – Auth service contract.
    - `impl/`
      - `auth-service.impl.ts` – Auth business logic.
      - `jwt-service.impl.ts` – JWT sign/verify logic.
      - `config-service.impl.ts` – Config wrapper around env vars.
  - `repository/`
    - `user-repository.interface.ts` – User repository contract.
    - `impl/`
      - `user-repository.impl.ts` – Drizzle-based user persistence.
  - `db/`
    - `schema.ts` – Drizzle table definitions (e.g. `user`).
    - `index.ts` – Drizzle client and transaction types.
  - `model/`
    - `index.ts` – DB model types (`User`, `NewUser`, etc.).
  - `dto/`
    - `auth-service.dto.ts` – DTOs for auth-related operations.
    - `zod/`
      - `auth-service.zod.ts` – Zod schemas for auth routes.
  - `middleware/`
    - `auth-middleware.ts` – JWT verification and `req.user` population.
    - `schema-validation-middleware.ts` – Zod-based body validation helper.
  - `di/`
    - `types.ts` – Inversify token map (`TYPES.*`).
    - `inversify.config.ts` – Container bindings for services, repositories, and DB.
  - `errors/`
    - `index.ts` – Shared error classes (`UnauthorizedError`, `DatabaseError`, etc.).
  - `types/`
    - `express.d.ts` – Express type augmentation (e.g. `req.user`).

- **Root**
  - `index.ts` – Application entrypoint (used by Bun and Docker).
  - `drizzle.config.ts` – Drizzle CLI configuration.
  - `docker-compose.yml` – Postgres (and future backend) services.
  - `Dockerfile` – Backend container image definition.
  - `instructions/` – LLM-facing docs on how to extend this backend.

---

## Instructions folder

The `instructions/` folder contains detailed, project-specific guides:

- `instructions/naming-conventions.md`  
  Naming rules for files, types, services, repositories, tables, DTOs, DI tokens, and routes.

- `instructions/add-new-route.md`  
  Step-by-step checklist to add a new API route:
  - Define DTOs and Zod schemas.
  - Implement/extend service & repository.
  - Wire DI.
  - Create/update controller and import it in `app.ts`.

- `instructions/add-new-table.md`  
  Step-by-step checklist to add a new DB table:
  - Extend `src/db/schema.ts`.
  - Add new model types in `src/model/index.ts`.
  - Create repository interface + implementation.
  - Bind the repository in DI and integrate into services/routes as needed.

If you are an LLM editing this repo, **always read these files first** before making structural changes.

---

## Environment configuration

The backend expects a PostgreSQL database reachable via `DATABASE_URL`.

- Example connection string:

```bash
DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres
```

You can use `.env` / `.env.local` as long as it matches what `dotenv` loads (`drizzle.config.ts` and `src/db/index.ts` both rely on `process.env.DATABASE_URL`).

---

## Running locally (without Docker)

1. **Install Bun** (see the Bun docs for your platform).
2. **Install dependencies**:

```bash
bun install
```

3. **Ensure Postgres is running** and `DATABASE_URL` is set in your environment.
4. **Run migrations**:

```bash
bun run db:migrate
```

5. **Start the backend**:

```bash
bun run index.ts
```

By default, the app listens on port `8000` (see `index.ts` / `Dockerfile` CMD).

---

## Running with Docker

### 1. Start Postgres via docker-compose

`docker-compose.yml` currently defines a PostgreSQL service and a commented-out backend service.

To start just the database:

```bash
docker compose up db
```

This will:

- Launch a `postgres:latest` container.
- Expose it on `localhost:5432`.
- Use `postgres/postgres` as user/password and `postgres` as the database name.

Set `DATABASE_URL` accordingly in your environment or `.env`:

```bash
DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres
```

### 2. Build and run the backend container

The `Dockerfile` expects `DATABASE_URL` at runtime and will:

- Install dependencies.
- Run `bun run db:migrate`.
- Then start the app with `bun run index.ts`.

Build the image:

```bash
docker build -t backend .
```

Run the container (assuming Postgres is already running, e.g. via docker-compose):

```bash
docker run \
  --name backend \
  -p 8000:8000 \
  -e DATABASE_URL=postgres://postgres:postgres@host.docker.internal:5432/postgres \
  backend
```

> Note: Depending on your Docker host setup (Linux vs macOS/Windows), you may need to adjust the hostname (`host.docker.internal` vs `localhost` or a container network alias).

### 3. Optional: enable backend in docker-compose

There is a commented-out backend service in `docker-compose.yml`.  
To manage both app and DB via compose:

1. Uncomment the `backend:` section.
2. Ensure the `.env` (or `.env.example` copied to `.env`) has a `DATABASE_URL` that points at the compose `db` service.
3. Run:

```bash
docker compose up --build
```

---

## Database migrations and Drizzle Studio

This project uses **Drizzle ORM** with **drizzle-kit**.  
Key configuration lives in `drizzle.config.ts`:

- `out: "./src/migrations"` – Migrations directory.
- `schema: "./src/db/schema.ts"` – Single source of truth for tables.
- `dbCredentials.url: process.env.DATABASE_URL` – DB connection.

### Common Drizzle commands

All of these are wired through `package.json` scripts:

- **Generate migrations from schema changes**:

```bash
bun run db:generate
```

- **Apply migrations to the database**:

```bash
bun run db:migrate
```

- **Push schema directly (auto-migrate)**:

```bash
bun run db:push
```

- **Open Drizzle Studio** (visual DB browser):

```bash
bun run db:studio
```

Ensure `DATABASE_URL` is set before running any of these commands.

---

## Quick API test

With the app running (locally or via Docker) on `http://localhost:8000`:

- **Auth routes** (under `/api/auth`) handle registration and login and return JWTs.
- **Test route** (requires a valid JWT in `Authorization` header):

```http
POST /api/test/hello
Authorization: Bearer <your-jwt>
Content-Type: application/json

{
  "name": "World"
}
```

Response:

```json
{
  "message": "hello world World"
}
```

For more details on how to add new routes, tables, and services, see the `instructions/` folder.
