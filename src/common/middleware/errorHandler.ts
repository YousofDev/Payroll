import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { BusinessException } from "@exception/BusinessException";
import { logger } from "@util/logger";

interface ErrorResponse {
  status: number;
  message: string;
  details?: string[];
}

const errorHandler = (
  err: unknown,
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

  logger.error(`${err}`);

  res.status(response.status).json(response);
};

export default errorHandler;
