import { Router } from "express";
import { container } from "@config/dependencyContainer";
import { EmployeeController } from "@app/controller/EmployeeController";
import { env } from "@config/env";
import { catchRouteErrors } from "@util/catchRouteErrors";

const path = `${env.API_VERSION}/employees`;

const controller = container.resolve<EmployeeController>("EmployeeController");

const router = Router();

router.get(`${path}`, controller.getAllEmployees.bind(controller));

router.post(`${path}`, controller.createEmployee.bind(controller));

router.get(`${path}/:id`, controller.getEmployeeById.bind(controller));

router.put(`${path}/:id`, controller.updateEmployee.bind(controller));

router.delete(`${path}/:id`, controller.deleteEmployeeById.bind(controller));

catchRouteErrors(router);

export const employeeRoutes = router;
