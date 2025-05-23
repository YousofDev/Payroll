import { Router } from "express";
import { container } from "@config/dependencyContainer";
import { env } from "@config/env";
import { catchRouteErrors } from "@util/catchRouteErrors";
import { DeductionController } from "@app/controller/DeductionController";

const controller = container.resolve(
  DeductionController
);

const path = `${env.API_VERSION}/deductions`;

const router = Router();

router.get(`${path}`, controller.getAllDeductions.bind(controller));

router.post(`${path}`, controller.createDeduction.bind(controller));

router.get(`${path}/:id`, controller.getDeductionById.bind(controller));

router.put(`${path}/:id`, controller.updateDeduction.bind(controller));

router.delete(`${path}/:id`, controller.deleteDeductionById.bind(controller));

catchRouteErrors(router);

export const deductionRoutes = router;
