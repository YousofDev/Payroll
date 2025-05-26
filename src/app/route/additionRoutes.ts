import { Router } from "express";
import { container } from "@config/dependencyContainer";
import { AdditionController } from "@app/controller/AdditionController";
import { env } from "@config/env";
import { catchRouteErrors } from "@util/catchRouteErrors";
import { hasAuthority } from "@middleware/hasAuthority";

const path = `${env.API_VERSION}/additions`;

const controller = container.resolve(AdditionController);

const router = Router();

router.use(hasAuthority("ADMIN", "HR"))

router.get(path, controller.getAllAdditions.bind(controller));

router.post(path, controller.createAddition.bind(controller));

router.get(`${path}/:id`, controller.getAdditionById.bind(controller));

router.put(`${path}/:id`, controller.updateAddition.bind(controller));

router.delete(`${path}/:id`, controller.deleteAdditionById.bind(controller));

catchRouteErrors(router);

export const additionRoutes = router;
