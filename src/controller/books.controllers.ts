import {
  controller,
  httpGet,
  httpPost,
  httpPut,
  httpDelete,
  request,
  response,
} from "inversify-express-utils";
import { inject } from "inversify";
import { TYPES } from "@/di/types";

import type { interfaces } from "inversify-express-utils";
import type { Request, Response } from "express";
import type { BooksService } from "@/service/books-service.interface";
import { validateBody } from "@/middleware/schema-validation-middleware";
import { authMiddleware } from "@/middleware/auth-middleware";
import {
  createBookSchema,
  updateBookSchema,
} from "@/dto/zod/books-service.zod";

@controller("/api/books")
export class BooksController implements interfaces.Controller {
  constructor(@inject(TYPES.BooksService) private booksService: BooksService) {}

  @httpGet("/")
  private async getAll(@request() req: Request, @response() res: Response) {
    const books = await this.booksService.getAll();
    res.json({ books });
  }

  @httpGet("/:id")
  private async getById(@request() req: Request, @response() res: Response) {
    const book = await this.booksService.getById(req.params.id!);
    res.json({ book });
  }

  @httpPost("/", authMiddleware, validateBody(createBookSchema))
  private async create(@request() req: Request, @response() res: Response) {
    const book = await this.booksService.create(req.body);
    res.status(201).json({ book });
  }

  @httpPut("/:id", authMiddleware, validateBody(updateBookSchema))
  private async update(@request() req: Request, @response() res: Response) {
    const book = await this.booksService.update(req.params.id!, req.body);
    res.json({ book });
  }

  @httpDelete("/:id", authMiddleware)
  private async delete(@request() req: Request, @response() res: Response) {
    const book = await this.booksService.delete(req.params.id!);
    res.json({ message: "Book deleted successfully", book });
  }
}
