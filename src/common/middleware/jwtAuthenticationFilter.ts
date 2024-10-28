import { AuthenticationException } from "@exception/AuthenticationException";
import { permittedRoutes } from "@config/constants";
import { JwtUtil } from "@util/JwtUtil";
import { NextFunction, Request, Response } from "express";
import { catchMiddlewareErrors } from "@util/catchMiddlewareErrors";
import { logger } from "@util/logger";
import { container } from "@config/dependencyContainer";
import { UserService } from "@app/service/UserService";

export const jwtAuthenticationFilter = catchMiddlewareErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    let token: string;
    let userEmail: string;

    const authorization = req.headers.authorization;

    if (permittedRoutes.includes(req.url)) {
      return next();
    }

    if (authorization == undefined) {
      throw new AuthenticationException("Authentication Bearer missing");
    }

    if (authorization.startsWith("Bearer")) {
      token = authorization.split(" ")[1];

      const jwtUtil = container.resolve<JwtUtil>("JwtUtil");

      const payload = await jwtUtil.verifyAccessToken(token);
      
      if (payload == undefined || payload?.userEmail == undefined) {
        throw new AuthenticationException();
      }

      userEmail = payload.userEmail;

      const userService = container.resolve<UserService>("UserService");

      const user = await userService.getUserByEmail(userEmail);

      if (!user) {
        throw new AuthenticationException();
      }

      req.userEmail = user.email;
      req.userRole = user.role;
    }

    next();
  }
);
