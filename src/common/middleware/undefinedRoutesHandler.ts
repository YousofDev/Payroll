import { NextFunction, Request, Response } from "express";
import { NotFoundException } from "@exception/NotFoundException";

export const undefinedRoutesHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new NotFoundException(
    `This route does not exist: <${req.method}> ${req.originalUrl}`
  );

  next(error);
};
