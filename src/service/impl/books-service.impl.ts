import { inject, injectable } from "inversify";
import { TYPES } from "@/di/types";
import { NotFoundError } from "@/errors";
import { randomUUID } from "crypto";
import type { BooksService } from "../books-service.interface";
import type { BookRepository } from "@/repository/book-repository.interface";
import type {
  BookPayload,
  CreateBookDto,
  UpdateBookDto,
} from "@/dto/books-service.dto";

@injectable()
export class BooksServiceImpl implements BooksService {
  constructor(
    @inject(TYPES.BookRepository) private bookRepository: BookRepository,
  ) {}

  async getAll(): Promise<BookPayload[]> {
    const result = await this.bookRepository.findAll();
    return result as BookPayload[];
  }

  async getById(id: string): Promise<BookPayload> {
    const book = await this.bookRepository.findById(id);
    if (!book) throw new NotFoundError("Book not found");
    return book as BookPayload;
  }

  async create(dto: CreateBookDto): Promise<BookPayload> {
    const book = await this.bookRepository.create({
      id: randomUUID(),
      ...dto,
    });
    if (!book) throw new NotFoundError("Failed to create book");
    return book as BookPayload;
  }

  async update(id: string, dto: UpdateBookDto): Promise<BookPayload> {
    const existing = await this.bookRepository.findById(id);
    if (!existing) throw new NotFoundError("Book not found");
    const updated = await this.bookRepository.update(id, dto);
    if (!updated) throw new NotFoundError("Failed to update book");
    return updated as BookPayload;
  }

  async delete(id: string): Promise<BookPayload> {
    const existing = await this.bookRepository.findById(id);
    if (!existing) throw new NotFoundError("Book not found");
    const deleted = await this.bookRepository.delete(id);
    if (!deleted) throw new NotFoundError("Failed to delete book");
    return deleted as BookPayload;
  }
}
