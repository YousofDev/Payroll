import { Router } from "express";
import { container } from "@config/dependencyContainer";
import { env } from "@config/env";
import { PayslipController } from "@app/controller/PayslipController";

const controller = container.resolve<PayslipController>("PayslipController");

const path = `${env.API_VERSION}/payslips`;

const router = Router();

router.post(path, controller.generatePayslip);

router.get(`${path}/:id`, controller.getPayslipById);

export const payslipRoutes = router
