import { Router } from "express";
import { container } from "@config/dependencyContainer";
import { env } from "@config/env";
import { DeductionController } from "@app/controller/DeductionController";

const controller = container.resolve<DeductionController>(
  "DeductionController"
);

const path = `${env.API_VERSION}/deductions`;

const router = Router();

router.get(`${path}`, controller.getAllDeductions);

router.post(`${path}`, controller.createDeduction);

router.get(`${path}/:id`, controller.getDeductionById);

router.put(`${path}/:id`, controller.updateDeduction);

router.delete(`${path}/:id`, controller.deleteDeductionById);

export const deductionRoutes = router;
