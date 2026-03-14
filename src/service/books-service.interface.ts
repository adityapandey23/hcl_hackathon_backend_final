import type {
  BookPayload,
  CreateBookDto,
  UpdateBookDto,
} from "@/dto/books-service.dto";

export interface BooksService {
  getAll(): Promise<BookPayload[]>;
  getById(id: string): Promise<BookPayload>;
  create(dto: CreateBookDto): Promise<BookPayload>;
  update(id: string, dto: UpdateBookDto): Promise<BookPayload>;
  delete(id: string): Promise<BookPayload>;
}
