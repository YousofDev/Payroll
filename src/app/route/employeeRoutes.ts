import { Router } from "express";
import { EmployeeController } from "@app/controller/EmployeeController";

export const createEmployeeRoutes = (controller: EmployeeController) => {
  const router = Router();

  router.get("/api/v1/employees", controller.getAllEmployees.bind(controller));

  router.post("/api/v1/employees", controller.createEmployee.bind(controller));

  router.get(
    "/api/v1/employees/:employeeId",
    controller.getEmployeeById.bind(controller)
  );

  router.put(
    "/api/v1/employees/:employeeId",
    controller.updateEmployee.bind(controller)
  );

  router.delete(
    "/api/v1/employees/:employeeId",
    controller.deleteEmployeeById.bind(controller)
  );

  return router;
};
