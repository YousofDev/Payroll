import { Router } from "express";
import { DeductionTypeController } from "@app/controller/DeductionTypeController";
import { env } from "@config/env";

export const createDeductionTypeRoutes = (
  controller: DeductionTypeController
) => {
  const router = Router();

  const basePath = `${env.API_VERSION}/deduction-types`;

  router.get(`${basePath}`, controller.getAllDeductionTypes.bind(controller));

  router.post(`${basePath}`, controller.createDeductionType.bind(controller));

  router.get(
    `${basePath}/:deductionTypeId`,
    controller.getDeductionTypeById.bind(controller)
  );

  router.put(
    `${basePath}/:deductionTypeId`,
    controller.updateDeductionType.bind(controller)
  );

  router.delete(
    `${basePath}/:deductionTypeId`,
    controller.deleteDeductionTypeById.bind(controller)
  );

  return router;
};
