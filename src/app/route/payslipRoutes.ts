import { Router } from "express";
import { container } from "@config/dependencyContainer";
import { env } from "@config/env";
import { PayslipController } from "@app/controller/PayslipController";
import { catchRouteErrors } from "@util/catchRouteErrors";
import { hasAuthority } from "@middleware/hasAuthority";

const controller = container.resolve(PayslipController);

const path = `${env.API_VERSION}/payslips`;

const router = Router();

router.get(path, controller.getAllPayslips.bind(controller));

router.post(path, controller.generatePayslips.bind(controller));

router.get(`${path}/:id`, controller.getPayslipById.bind(controller));

router.delete(
  `${path}/:id`,
  hasAuthority("ADMIN"),
  controller.deletePayslipById.bind(controller)
);

catchRouteErrors(router);

export const payslipRoutes = router;
