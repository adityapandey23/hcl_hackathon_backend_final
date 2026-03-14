export class AppError extends Error {
  public readonly status: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    status: number = 500,
    isOperational: boolean = true,
  ) {
    super(message);
    this.status = status;
    this.isOperational = isOperational; // operational = expected errors (user input, not found, etc.)
    Error.captureStackTrace(this, this.constructor);
  }
}

// 400 - Bad Request
export class BadRequestError extends AppError {
  constructor(message: string = "Bad request") {
    super(message, 400);
  }
}

// 401 - Unauthorized
export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
  }
}

// 404 - Not Found
export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404);
  }
}

// 409 - Conflict
export class ConflictError extends AppError {
  constructor(message: string = "Resource already exists") {
    super(message, 409);
  }
}

// 500 - Internal Server Error (for unexpected errors)
export class InternalError extends AppError {
  constructor(message: string = "Internal server error") {
    super(message, 500, false); // isOperational = false means this is a programmer error
  }
}

// Database-specific error (for repository layer)
export class DatabaseError extends AppError {
  public readonly originalError?: Error;

  constructor(
    message: string = "Database operation failed",
    originalError?: Error,
  ) {
    super(message, 500, false); // isOperational = false since this is unexpected
    this.originalError = originalError;
  }
}
