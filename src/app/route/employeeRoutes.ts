import { Router } from "express";
import { container } from "@config/dependencyContainer";
import { EmployeeController } from "@app/controller/EmployeeController";
import { env } from "@config/env";

const path = `${env.API_VERSION}/employees`;

const controller = container.resolve<EmployeeController>("EmployeeController");

const router = Router();

router.get(`${path}`, controller.getAllEmployees);

router.post(`${path}`, controller.createEmployee);

router.get(`${path}/:id`, controller.getEmployeeById);

router.put(`${path}/:id`, controller.updateEmployee);

router.delete(`${path}/:id`, controller.deleteEmployeeById);

export const employeeRoutes = router;
