import { Router } from "express";
import { container } from "@config/dependencyContainer";
import { DeductionTypeController } from "@app/controller/DeductionTypeController";
import { env } from "@config/env";

const path = `${env.API_VERSION}/deduction-types`;

const controller = container.resolve<DeductionTypeController>(
  "DeductionTypeController"
);

const router = Router();

router.get(`${path}`, controller.getAllDeductionTypes);

router.post(`${path}`, controller.createDeductionType);

router.get(`${path}/:id`, controller.getDeductionTypeById);

router.put(`${path}/:id`, controller.updateDeductionType);

router.delete(`${path}/:id`, controller.deleteDeductionTypeById);

export const deductionTypeRoutes = router;
