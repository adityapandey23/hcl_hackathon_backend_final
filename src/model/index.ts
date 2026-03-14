import { user, session } from "@/db/schema";

// Types for accessing the data from the database
export type User = typeof user.$inferSelect;
export type Session = typeof session.$inferSelect;

// Types for adding the data to the database
export type NewUser = typeof user.$inferInsert;
export type NewSession = typeof session.$inferInsert;
