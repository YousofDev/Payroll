import { NextFunction, Request, Response } from "express";
import { catchMiddlewareErrors } from "@util/catchMiddlewareErrors";
import { AuthorizationException } from "@exception/AuthorizationException";
import { UserRole } from "@config/constants";

export const hasAuthority = (...roles: UserRole[]) =>
  catchMiddlewareErrors(
    async (req: Request, res: Response, next: NextFunction) => {
      const userRole = req.userRole;
      if (roles.includes(userRole)) {
        return next();
      } else {
        throw new AuthorizationException(
          "This action is not allowed for your role"
        );
      }
    }
  );
