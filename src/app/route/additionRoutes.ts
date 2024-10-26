import { Router } from "express";
import { AdditionController } from "@app/controller/AdditionController";
import { env } from "@config/env";

export const createAdditionRoutes = (controller: AdditionController) => {
  const router = Router();

  const basePath = `${env.API_VERSION}/additions`;

  router.get(`${basePath}`, controller.getAllAdditions.bind(controller));

  router.post(`${basePath}`, controller.createAddition.bind(controller));

  router.get(
    `${basePath}/:additionId`,
    controller.getAdditionById.bind(controller)
  );

  router.put(
    `${basePath}/:additionId`,
    controller.updateAddition.bind(controller)
  );

  router.delete(
    `${basePath}/:additionId`,
    controller.deleteAdditionById.bind(controller)
  );

  return router;
};
