import { authMiddleware } from "@/middleware/auth-middleware";
import type { Request } from "express";
import {
  controller,
  httpGet,
  httpPatch,
  request,
  response,
} from "inversify-express-utils";

import type { interfaces } from "inversify-express-utils";

@controller("/api/admin", authMiddleware)
export class AdminController implements interfaces.Controller {
  constructor() {}
  // Get all students
  // TODO: Add pagination
  @httpGet("/students")
  private async getStudents(
    @request() req: Request,
    @response() res: Response,
  ) {}

  // Get Student data
  // TODO: Add query parameter for the student id
  @httpGet("/students")
  private async getStudent(
    @request() req: Request,
    @response() res: Response,
  ) {}

  // Update Student data (This would include updating a student to a admin and approve a student's request)
  // TODO: Add query parameter for the student id
  @httpPatch("/students")
  private async updateStudent(
    @request() req: Request,
    @response() res: Response,
  ) {}
}
