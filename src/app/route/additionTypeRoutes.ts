import { Router } from "express";
import { container } from "@config/dependencyContainer";
import { AdditionTypeController } from "@app/controller/AdditionTypeController";
import { env } from "@config/env";
import { catchRouteErrors } from "@util/catchRouteErrors";

const path = `${env.API_VERSION}/addition-types`;

const controller = container.resolve(AdditionTypeController);

const router = Router();

router.get(`${path}`, controller.getAllAdditionTypes.bind(controller));

router.post(`${path}`, controller.createAdditionType.bind(controller));

router.get(`${path}/:id`, controller.getAdditionTypeById.bind(controller));

router.put(`${path}/:id`, controller.updateAdditionType.bind(controller));

router.delete(
  `${path}/:id`,
  controller.deleteAdditionTypeById.bind(controller)
);

catchRouteErrors(router);

export const additionTypeRoutes = router;
