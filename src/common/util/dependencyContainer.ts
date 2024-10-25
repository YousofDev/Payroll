import { EmployeeController } from "@app/controller/EmployeeController";
import { EmployeeRepository } from "@app/repository/EmployeeRepository";
import { EmployeeService } from "@app/service/EmployeeService";
import { DependencyService } from "./DependencyService";

export const container = new DependencyService();

container.register("EmployeeRepository", EmployeeRepository, true);
container.register("EmployeeService", EmployeeService, true);
container.register("EmployeeController", EmployeeController);

export const controllers = {
  employeeController:
    container.resolve<EmployeeController>("EmployeeController"),
};
