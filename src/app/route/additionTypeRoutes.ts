import { Router } from "express";
import { AdditionTypeController } from "@app/controller/AdditionTypeController";
import { env } from "@config/env";

export const createAdditionTypeRoutes = (
  controller: AdditionTypeController
) => {
  const router = Router();

  const basePath = `${env.API_VERSION}/addition-types`;

  router.get(`${basePath}`, controller.getAllAdditionTypes.bind(controller));

  router.post(`${basePath}`, controller.createAdditionType.bind(controller));

  router.get(
    `${basePath}/:additionTypeId`,
    controller.getAdditionTypeById.bind(controller)
  );

  router.put(
    `${basePath}/:additionTypeId`,
    controller.updateAdditionType.bind(controller)
  );

  router.delete(
    `${basePath}/:additionTypeId`,
    controller.deleteAdditionTypeById.bind(controller)
  );

  return router;
};
