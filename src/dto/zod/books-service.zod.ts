import { z } from "zod";

export const createBookSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  publishedYear: z.number().int().optional(),
  categoryId: z.string().optional(),
  isAvailable: z.string().optional(),
});

export const updateBookSchema = createBookSchema.partial();
