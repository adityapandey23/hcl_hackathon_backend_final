import {
  text,
  timestamp,
  pgEnum,
  pgTable,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Enums ───────────────────────────────────────────────────────────────────
export const roleEnum = pgEnum("role", ["admin", "student"]);

export const borrowStatusEnum = pgEnum("borrow_status", [
  "BORROWED",
  "RETURNED",
  "OVERDUE",
]);

export const categoryEnum = pgEnum("category", [
  "FICTION",
  "NON_FICTION",
  "SCIENCE",
  "TECHNOLOGY",
  "HISTORY",
  "BIOGRAPHY",
  "MATHEMATICS",
  "ARTS",
  "LAW",
  "MEDICINE",
  "OTHER",
]);

// ─── Common Columns ───────────────────────────────────────────────────────────
const commonColumns = () => ({
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

// ─── Actual Schema ───────────────────────────────────────────────────────────
export const users = pgTable("users", {
  ...commonColumns(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: roleEnum("role").notNull().default("student"),
});

export const authors = pgTable("authors", {
  ...commonColumns(),
  name: text("name").notNull(),
  email: text("email").unique(),
});

export const books = pgTable("books", {
  ...commonColumns(),
  isAvailable: boolean("is_available").notNull().default(true),
  bookSetId: text("book_set_id")
    .notNull()
    .references(() => booksSet.id),
});
export const publishers = pgTable("publishers", {
  ...commonColumns(),
  name: text("name").notNull(),
  email: text("email").unique(),
});

export const booksSet = pgTable("books-set", {
  ...commonColumns(),
  title: text("title").notNull(),
  description: text("description"),
  isbn: text("isbn").notNull().unique(),
  publishedYear: integer("published_year"),
  category: categoryEnum("category").notNull().default("OTHER"),
  publisherId: text("publisher_id").references(() => publishers.id),
  authorId: text("author_id").references(() => authors.id),
  count: integer("count").notNull().default(0),
});

export const bookTransactions = pgTable("book-transactions", {
  ...commonColumns(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  bookId: text("book_id")
    .notNull()
    .references(() => books.id),
  dueDate: timestamp("due_date").notNull(),
  returnDate: timestamp("return_date"),
  status: borrowStatusEnum("status").notNull().default("BORROWED"),
});

// ─── Relations ───────────────────────────────────────────────────────────────
export const usersRelations = relations(users, ({ many }) => ({
  transactions: many(bookTransactions),
}));

export const authorsRelations = relations(authors, ({ many }) => ({
  booksSets: many(booksSet),
}));

export const publishersRelations = relations(publishers, ({ many }) => ({
  booksSets: many(booksSet),
}));

export const booksSetRelations = relations(booksSet, ({ one, many }) => ({
  publisher: one(publishers, {
    fields: [booksSet.publisherId],
    references: [publishers.id],
  }),
  author: one(authors, {
    fields: [booksSet.authorId],
    references: [authors.id],
  }),
  books: many(books),
}));

export const booksRelations = relations(books, ({ one, many }) => ({
  bookSet: one(booksSet, {
    fields: [books.bookSetId],
    references: [booksSet.id],
  }),
  transactions: many(bookTransactions),
}));

export const bookTransactionsRelations = relations(
  bookTransactions,
  ({ one }) => ({
    user: one(users, {
      fields: [bookTransactions.userId],
      references: [users.id],
    }),
    book: one(books, {
      fields: [bookTransactions.bookId],
      references: [books.id],
    }),
  }),
);
