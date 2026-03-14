import type { DbOrTransaction } from "@/db";
import type { Book, NewBook } from "@/model";

export interface BookRepository {
  create(data: NewBook, tx?: DbOrTransaction): Promise<Book | undefined>;
  findAll(tx?: DbOrTransaction): Promise<Book[]>;
  findById(id: string, tx?: DbOrTransaction): Promise<Book | undefined>;
  update(
    id: string,
    data: Partial<NewBook>,
    tx?: DbOrTransaction,
  ): Promise<Book | undefined>;
  delete(id: string, tx?: DbOrTransaction): Promise<Book | undefined>;
}
