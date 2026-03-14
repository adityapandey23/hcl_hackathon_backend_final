import { user, books } from "@/db/schema";

// Types for accessing the data from the database
export type User = typeof user.$inferSelect;
export type Book = typeof books.$inferSelect;

// Types for adding the data to the database
export type NewUser = typeof user.$inferInsert;
export type NewBook = typeof books.$inferInsert;
