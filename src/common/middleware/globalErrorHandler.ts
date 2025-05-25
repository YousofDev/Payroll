import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { ZodError, ZodIssue } from "zod"; // Import ZodIssue
import { BusinessException } from "@exception/BusinessException";
import { logger } from "@util/logger";

interface ErrorResponse {
  status: number;
  message: string;
  details?: string[];
}

// Helper function to recursively extract ZodError details
const extractZodErrorDetails = (issues: ZodIssue[]): string[] => {
  const details: string[] = [];

  issues.forEach((issue) => {
    if ("unionErrors" in issue && Array.isArray(issue.unionErrors)) {
      // If it's a union error, recursively extract details from each union error
      issue.unionErrors.forEach((unionError: ZodError) => {
        details.push(...extractZodErrorDetails(unionError.errors));
      });
    } else {
      const fieldName =
        issue.path.length > 0
          ? issue.path[issue.path.length - 1]
          : "unknown field";
      details.push(`${fieldName}: ${issue.message}`);
    }
  });
  return details;
};

export const globalErrorHandler = (
  err: ErrorRequestHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const response: ErrorResponse = {
    status: 500,
    message: "An unexpected error occurred.",
  };

  if (err instanceof BusinessException) {
    response.status = err.status;
    response.message = err.message;
  } else if (err instanceof ZodError) {
    response.status = 400;
    response.message = "Validation Error";
    response.details = extractZodErrorDetails(err.errors);
  }

  if (err instanceof Error && err.stack) {
    logger.error(err.stack);
  } else {
    logger.error(`${err}`);
  }

  res.status(response.status).json(response);
};
