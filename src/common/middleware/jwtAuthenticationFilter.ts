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

    if (authorization == undefined || authorization.length == 0) {
      throw new AuthenticationException("Authentication credentials missing");
    }

    try {
      if (authorization.startsWith("Bearer")) {
        token = authorization.split(" ")[1];

        const jwtUtil = container.resolve(JwtUtil);

        const payload = await jwtUtil.verifyAccessToken(token);

        if (payload == undefined || payload?.userEmail == undefined) {
          throw new AuthenticationException("Invalid credentials");
        }

        userEmail = payload.userEmail;

        const userService = container.resolve(UserService);

        const user = await userService.getUserByEmail(userEmail);

        if (!user) {
          throw new AuthenticationException("Invalid credentials");
        }

        req.userEmail = user.email;
        req.userRole = user.role;

        return next();
      }
    } catch (error) {
      throw new AuthenticationException("Invalid credentials");
    }
  }
);
