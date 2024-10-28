import { Request, Response, NextFunction, RequestHandler } from "express";

export const catchMiddlewareErrors =
  (func: RequestHandler) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(func(req, res, next)).catch(next);
