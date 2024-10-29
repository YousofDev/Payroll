import { Router } from "express";
import { container } from "@config/dependencyContainer";
import { env } from "@config/env";
import { PayslipController } from "@app/controller/PayslipController";
import { catchRouteErrors } from "@util/catchRouteErrors";
import { hasAuthority } from "@middleware/hasAuthority";

const controller = container.resolve<PayslipController>("PayslipController");

const path = `${env.API_VERSION}/payslips`;

const router = Router();

router.post(path, controller.generatePayslip.bind(controller));

router.get(`${path}/:id`, controller.getPayslipById.bind(controller));

router.delete(
  `${path}/:id`,
  hasAuthority("ADMIN"),
  controller.deletePayslipById.bind(controller)
);

catchRouteErrors(router);

export const payslipRoutes = router;
