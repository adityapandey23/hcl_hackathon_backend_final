export type CreateBookDto = {
  title: string;
  description?: string;
  publishedYear?: number;
  categoryId?: string;
  isAvailable?: boolean;
};

export type UpdateBookDto = Partial<CreateBookDto>;

export type BookPayload = {
  id: string;
  title: string;
  description: string | null;
  publishedYear: number | null;
  categoryId: string | null;
  isAvailable: string | null;
  createdAt: Date | null;
};
