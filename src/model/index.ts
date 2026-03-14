import {
  user,
  authors,
  books,
  categories,
  bookAuthors,
  bookCopies,
  borrowTransactions,
} from "@/db/schema";

// Re-export schema enums for convenience
export { Role, copyStatusEnum, borrowStatusEnum } from "@/db/schema";

// --- User ---
export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;

// --- Author ---
export type Author = typeof authors.$inferSelect;
export type NewAuthor = typeof authors.$inferInsert;

// --- Book ---
export type Book = typeof books.$inferSelect;
export type NewBook = typeof books.$inferInsert;

// --- Category ---
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

// --- BookAuthor (junction) ---
export type BookAuthor = typeof bookAuthors.$inferSelect;
export type NewBookAuthor = typeof bookAuthors.$inferInsert;

// --- BookCopy ---
export type BookCopy = typeof bookCopies.$inferSelect;
export type NewBookCopy = typeof bookCopies.$inferInsert;

// --- BorrowTransaction ---
export type BorrowTransaction = typeof borrowTransactions.$inferSelect;
export type NewBorrowTransaction = typeof borrowTransactions.$inferInsert;
