import { user } from "@/db/schema";

// Types for accessing the data from the database
export type User = typeof user.$inferSelect;

// Types for adding the data to the database
export type NewUser = typeof user.$inferInsert;
