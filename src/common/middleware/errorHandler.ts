import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { BusinessException } from "@exception/BusinessException";
import { logger } from "@util/logger";

interface ErrorResponse {
  status: number;
  message: string;
  details?: string[];
}

export const errorHandler = (
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

    const details = err.errors.map((issue) => {
      const fieldName = issue.path[issue.path.length - 1];
      return `${fieldName} ${issue.message}`;
    });

    if (details.length > 0) {
      response.details = details;
    }
  }

  if (err instanceof Error && err.stack) {
    logger.error(err.stack);
  } else {
    logger.error(`${err}`);
  }

  res.status(response.status).json(response);
};
