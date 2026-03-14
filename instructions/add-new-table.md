# Adding a new table

Provide a repeatable process so an LLM can add a new database table (Drizzle schema + models + repository + DI) in a way that matches the existing `user` table and `UserRepositoryImpl`.

---

## 1. Define the new entity

1. **Choose an entity name** (singular): e.g. `session`, `profile`, `task`.
2. **List the fields** you need:
   - Required vs optional.
   - Data types (string, timestamp, etc.).
3. Decide if it should:
   - Have a UUID `id` like `user` (recommended).
   - Reuse `createdAt` and `updatedAt` (recommended via `commonColumns()`).

---

## 2. Add the table to Drizzle schema

Location: `src/db/schema.ts`

1. **Reuse `commonColumns()`** at the top of the table definition:
   - This provides `id`, `createdAt`, `updatedAt`.
2. **Create a new `pgTable` export** for the entity.
   - Use a **camelCase singular** identifier and a simple lower-case/snake_case table name.
3. **Use `drizzle-orm/pg-core` column types** that match your needs (e.g. `text`, `timestamp`, `integer`, `boolean`).

Example pattern (illustrative; adjust columns as needed):

```typescript
export const session = pgTable("session", {
  ...commonColumns(),
  userId: text("user_id").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});
```

- Keep the style identical to the existing `user` definition.
- Always prefer **snake_case** column names.

---

## 3. Expose model types for the new table

Location: `src/model/index.ts`

1. **Ensure the new table is imported** from `src/db/schema.ts`:
   - `import { user, session } from "@/db/schema";` (extend this import as needed).
2. **Add two exported types**:
   - `<Entity>`: row returned from the DB.
   - `New<Entity>`: row used for inserts.

Following the existing pattern:

- For `user`:
  - `export type User = typeof user.$inferSelect;`
  - `export type NewUser = typeof user.$inferInsert;`
- For a new `session` table, add:
  - `export type Session = typeof session.$inferSelect;`
  - `export type NewSession = typeof session.$inferInsert;`

This keeps all entity types centralized and discoverable by other layers (repositories and services).

---

## 4. Create or extend a repository interface

Location: `src/repository/<entity>-repository.interface.ts`

1. **If this repository does not exist**, create a new interface file.
   - Example: `src/repository/session-repository.interface.ts`.
2. **Import the model types** from `src/model`:
   - Example: `import type { Session, NewSession } from "@/model";`
3. **Define the interface** with CRUD and any extra queries:
   - Always return the select type (`Session`).
   - Accept `NewSession` or partials for inserts/updates.

Illustrative example:

```typescript
export interface SessionRepository {
  create(data: NewSession, tx?: DbOrTransaction): Promise<Session | undefined>;
  findById(id: string, tx?: DbOrTransaction): Promise<Session | undefined>;
  update(
    id: string,
    data: Partial<NewSession>,
    tx?: DbOrTransaction,
  ): Promise<Session | undefined>;
  delete(id: string, tx?: DbOrTransaction): Promise<Session | undefined>;
}
```

Use `UserRepository` as the canonical reference for naming and signatures.

---

## 5. Implement the repository with Drizzle

Location: `src/repository/impl/<entity>-repository.impl.ts`

1. **Create a new class** `<Entity>RepositoryImpl` similar to `UserRepositoryImpl`.
2. **Annotate with `@injectable()`**.
3. **Inject the database** via constructor:
   - `constructor(@inject(TYPES.Database) private database: NodePgDatabase) {}`
4. **Use `DbOrTransaction`** for optional transactions:
   - Determine `db` with `const db = tx ?? this.database;`.
5. **Implement methods**:
   - `create`: `db.insert(table).values(data).returning();`
   - `findById`: `db.select().from(table).where(eq(table.id, id)).limit(1);`
   - `update`: `db.update(table).set({ ...data, updatedAt: new Date() })...`
   - `delete`: `db.delete(table).where(eq(table.id, id))...`
6. **Wrap DB errors** using `DatabaseError` from `src/errors`:
   - `throw new DatabaseError("Failed to create session", error as Error);`

Mirror `UserRepositoryImpl` line-by-line for style, error handling, and Drizzle usage.

---

## 6. Wire the repository into DI

Location: `src/di/types.ts` and `src/di/inversify.config.ts`

1. **Add a DI token** for the new repository in `types.ts`:
   - Example: `SessionRepository` → `TYPES.SessionRepository`.
2. **Bind the implementation in `inversify.config.ts`**:
   - Import both the interface type and implementation class.
   - Add:
     - `container.bind<SessionRepository>(TYPES.SessionRepository).to(SessionRepositoryImpl);`
3. Follow the exact pattern used for `UserRepository`.

This ensures services can inject the repository with `@inject(TYPES.SessionRepository)`.

---

## 7. Integrate with services (optional but typical)

If the new table is part of an existing or new domain service:

1. **Update or create the service interface** in `src/service/<domain>-service.interface.ts`.
2. **Inject the repository** in the service implementation:
   - `constructor(@inject(TYPES.SessionRepository) private sessionRepository: SessionRepository, ...) {}`
3. **Expose methods** that operate on the new table:
   - Example: `createSession`, `getSessionById`, `invalidateSession`, etc.
4. **Use DTOs and Zod schemas** (see `add-new-route.md`) to control what reaches controllers.

---

## 8. Consider migrations (if applicable)

This project defines schema via Drizzle in code; if you are using schema migrations:

1. **Generate or write a migration** that matches the new table definition in `src/db/schema.ts`.
2. **Ensure the migration is idempotent** and safe to run on existing databases.
3. **Document any breaking changes** (e.g. non-null columns without defaults).

If you are unsure whether migrations are in use, do not delete or alter existing tables; only add new ones in a backward-compatible way.

---

## 9. Final checklist for adding a new table

Before considering the new table complete, an LLM should verify:

1. **Table is defined** in `src/db/schema.ts` using `pgTable` and `commonColumns()`.
2. **Model types are exported** in `src/model/index.ts`:
   - `<Entity>` and `New<Entity>`.
3. **Repository interface exists** in `src/repository/<entity>-repository.interface.ts`.
4. **Repository implementation exists** in `src/repository/impl/<entity>-repository.impl.ts`.
5. **Repository is bound in DI**:
   - Token in `src/di/types.ts`.
   - Binding in `src/di/inversify.config.ts`.
6. **Service layer** (if any) is updated to use the repository.
7. **Routes and DTOs** (if any) that depend on this entity are added or updated (see `add-new-route.md`).
8. **Error handling** in the repository uses `DatabaseError` and follows the `UserRepositoryImpl` pattern.
