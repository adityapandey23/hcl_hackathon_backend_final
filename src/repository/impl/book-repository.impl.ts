import { books } from "@/db/schema";
import { TYPES } from "@/di/types";
import type { Book, NewBook } from "@/model";
import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { inject, injectable } from "inversify";
import { DatabaseError } from "@/errors";
import type { DbOrTransaction } from "@/db";
import type { BookRepository } from "../book-repository.interface";

@injectable()
export class BookRepositoryImpl implements BookRepository {
  constructor(@inject(TYPES.Database) private database: NodePgDatabase) {}

  async create(data: NewBook, tx?: DbOrTransaction): Promise<Book | undefined> {
    const db = tx ?? this.database;
    try {
      const [created] = await db.insert(books).values(data).returning();
      return created;
    } catch (error) {
      throw new DatabaseError("Failed to create book", error as Error);
    }
  }

  async findAll(tx?: DbOrTransaction): Promise<Book[]> {
    const db = tx ?? this.database;
    try {
      return await db.select().from(books);
    } catch (error) {
      throw new DatabaseError("Failed to fetch books", error as Error);
    }
  }

  async findById(id: string, tx?: DbOrTransaction): Promise<Book | undefined> {
    const db = tx ?? this.database;
    try {
      const [found] = await db
        .select()
        .from(books)
        .where(eq(books.id, id))
        .limit(1);
      return found;
    } catch (error) {
      throw new DatabaseError("Failed to find book by ID", error as Error);
    }
  }

  async update(
    id: string,
    data: Partial<NewBook>,
    tx?: DbOrTransaction,
  ): Promise<Book | undefined> {
    const db = tx ?? this.database;
    try {
      const [updated] = await db
        .update(books)
        .set(data)
        .where(eq(books.id, id))
        .returning();
      return updated;
    } catch (error) {
      throw new DatabaseError("Failed to update book", error as Error);
    }
  }

  async delete(id: string, tx?: DbOrTransaction): Promise<Book | undefined> {
    const db = tx ?? this.database;
    try {
      const [deleted] = await db
        .delete(books)
        .where(eq(books.id, id))
        .returning();
      return deleted;
    } catch (error) {
      throw new DatabaseError("Failed to delete book", error as Error);
    }
  }
}
