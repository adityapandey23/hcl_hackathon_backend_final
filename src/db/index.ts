import "dotenv/config";
import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

// Adding a pool to the database connection
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool);

// Type for database transaction - can be used in repositories to accept optional tx
export type Transaction = Parameters<
  Parameters<NodePgDatabase["transaction"]>[0]
>[0];
export type DbOrTransaction = NodePgDatabase | Transaction;
