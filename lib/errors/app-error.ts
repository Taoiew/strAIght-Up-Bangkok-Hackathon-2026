export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode = 500,
    public readonly code = "APP_ERROR",
  ) {
    super(message);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Please log in to continue.") {
    super(message, 401, "AUTHENTICATION_ERROR");
  }
}

export class ValidationError extends AppError {
  constructor(message = "The request is invalid.") {
    super(message, 400, "VALIDATION_ERROR");
  }
}

export class DatabaseError extends AppError {
  constructor(message = "The database is temporarily unavailable.") {
    super(message, 503, "DATABASE_ERROR");
  }
}

export class OpenAIError extends AppError {
  constructor(message = "The AI service is temporarily unavailable. Please try again.") {
    super(message, 503, "OPENAI_ERROR");
  }
}

export class ToolExecutionError extends AppError {
  constructor(message = "A tool could not complete successfully.") {
    super(message, 500, "TOOL_EXECUTION_ERROR");
  }
}

export class RateLimitError extends AppError {
  constructor(message = "Too many requests. Please wait and try again.") {
    super(message, 429, "RATE_LIMIT_ERROR");
  }
}

export class ConfigurationError extends AppError {
  constructor(message = "Required configuration is missing.") {
    super(message, 500, "CONFIGURATION_ERROR");
  }
}

export function toPublicError(error: unknown) {
  if (error instanceof AppError) {
    return {
      message: error.message,
      statusCode: error.statusCode,
      code: error.code,
    };
  }

  return {
    message: "Something went wrong. Please try again.",
    statusCode: 500,
    code: "INTERNAL_ERROR",
  };
}
