import { Router } from "express";
import { container } from "@config/dependencyContainer";
import { UserController } from "@app/controller/UserController";
import { env } from "@config/env";
import { catchRouteErrors } from "@util/catchRouteErrors";
import { hasAuthority } from "@middleware/hasAuthority";

const path = `${env.API_VERSION}/users`;

const controller = container.resolve<UserController>("UserController");

const router = Router();

router.post(`${path}/register`, controller.register.bind(controller));

router.post(`${path}/login`, controller.login.bind(controller));

router.get(`${path}/:id`, controller.getUserById.bind(controller));

router.get(
  `${path}`,
  hasAuthority("ADMIN"),
  controller.getAllUsers.bind(controller)
);

router.patch(
  `${path}/:id/assign-role`,
  // hasAuthority("ADMIN"),
  controller.assignRole.bind(controller)
);

router.delete(
  `${path}/:id`,
  hasAuthority("ADMIN"),
  controller.deleteUserById.bind(controller)
);

catchRouteErrors(router);

export const userRoutes = router;
