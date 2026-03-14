import { user } from "@/db/schema";
import { TYPES } from "@/di/types";
import type { NewUser, User } from "@/model";
import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { inject, injectable } from "inversify";
import { DatabaseError } from "@/errors";
import type { DbOrTransaction } from "@/db";
import type { UserRepository } from "../user-repository.interface";

@injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(@inject(TYPES.Database) private database: NodePgDatabase) {}

  // Basic CRUD Operations
  async create(data: NewUser, tx?: DbOrTransaction): Promise<User | undefined> {
    const db = tx ?? this.database;
    try {
      const [created] = await db.insert(user).values(data).returning();
      return created;
    } catch (error) {
      throw new DatabaseError("Failed to create user", error as Error);
    }
  }

  async findById(id: string, tx?: DbOrTransaction): Promise<User | undefined> {
    const db = tx ?? this.database;
    try {
      const [found] = await db
        .select()
        .from(user)
        .where(eq(user.id, id))
        .limit(1);
      return found;
    } catch (error) {
      throw new DatabaseError("Failed to find user by ID", error as Error);
    }
  }

  async update(
    id: string,
    data: Partial<NewUser>,
    tx?: DbOrTransaction,
  ): Promise<User | undefined> {
    const db = tx ?? this.database;
    try {
      const [updated] = await db
        .update(user)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(user.id, id))
        .returning();
      return updated;
    } catch (error) {
      throw new DatabaseError("Failed to update user", error as Error);
    }
  }

  async delete(id: string, tx?: DbOrTransaction): Promise<User | undefined> {
    const db = tx ?? this.database;
    try {
      const [deleted] = await db
        .delete(user)
        .where(eq(user.id, id))
        .returning();
      return deleted;
    } catch (error) {
      throw new DatabaseError("Failed to delete user", error as Error);
    }
  }

  // Enhanced CRUD Operations
  async findByEmail(
    email: string,
    tx?: DbOrTransaction,
  ): Promise<User | undefined> {
    const db = tx ?? this.database;
    try {
      const [found] = await db
        .select()
        .from(user)
        .where(eq(user.email, email))
        .limit(1);
      return found;
    } catch (error) {
      throw new DatabaseError("Failed to find user by email", error as Error);
    }
  }
}
