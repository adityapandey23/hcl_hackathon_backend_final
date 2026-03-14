import {
  pgTable,
  text,
  timestamp,
  integer,
  primaryKey,
  pgEnum,
} from "drizzle-orm/pg-core";

// Common Enum for all tables
export enum Role {
  ADMIN = "admin",
  USER = "user",
}

export const copyStatusEnum = pgEnum("copy_status", [
  "AVAILABLE",
  "BORROWED",
  "LOST",
  "DAMAGED",
]);

export const borrowStatusEnum = pgEnum("borrow_status", [
  "BORROWED",
  "RETURNED",
  "OVERDUE",
]);

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

export const authors = pgTable("author", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
});

export const books = pgTable("books", {
  id: text("id").primaryKey(),

  title: text("title").notNull(),

  isAvailable: text("is_available"),

  description: text("description"),

  publishedYear: integer("published_year"),

  categoryId: text("category_id").references(() => categories.id),

  createdAt: timestamp("created_at").defaultNow(),
});

export const bookAuthors = pgTable(
  "book_authors",
  {
    bookId: text("book_id")
      .notNull()
      .references(() => books.id),

    authorId: text("author_id")
      .notNull()
      .references(() => authors.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.bookId, table.authorId] }),
  }),
);

export const categories = pgTable("categories", {
  id: text("id").primaryKey(),

  name: text("name").notNull(),
});

export const bookCopies = pgTable("book_copies", {
  id: text("id").primaryKey(),

  bookId: text("book_id")
    .notNull()
    .references(() => books.id),

  status: copyStatusEnum("status").default("AVAILABLE"),
});

export const borrowTransactions = pgTable("borrow_transactions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  copyId: text("copy_id")
    .notNull()
    .references(() => bookCopies.id),
  borrowDate: timestamp("borrow_date").notNull(),
  dueDate: timestamp("due_date").notNull(),
  returnDate: timestamp("return_date"),
  status: borrowStatusEnum("status").default("BORROWED"),
});
