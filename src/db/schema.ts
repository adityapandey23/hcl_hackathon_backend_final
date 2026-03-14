import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

// Common Enum for all tables
export enum Role {
  ADMIN = "admin",
  USER = "user",
}

// Common columns for all tables
const commonColumns = () => ({
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

// Schema definitions
export const user = pgTable("user", {
  ...commonColumns(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default(Role.USER),
});
