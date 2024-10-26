import { EmployeeController } from "@app/controller/EmployeeController";
import { EmployeeRepository } from "@app/repository/EmployeeRepository";
import { EmployeeService } from "@app/service/EmployeeService";
import { DependencyService } from "./DependencyService";
import { AdditionTypeRepository } from "@app/repository/AdditionTypeRepository";
import { AdditionTypeService } from "@app/service/AdditionTypeService";
import { AdditionTypeController } from "@app/controller/AdditionTypeController";

export const container = new DependencyService();

container.register("EmployeeRepository", EmployeeRepository, true);
container.register("EmployeeService", EmployeeService, true);
container.register("EmployeeController", EmployeeController);

container.register("AdditionTypeRepository", AdditionTypeRepository, true);
container.register("AdditionTypeService", AdditionTypeService, true);
container.register("AdditionTypeController", AdditionTypeController);

export const controllers = {
  employeeController:
    container.resolve<EmployeeController>("EmployeeController"),
  additionTypeController: container.resolve<AdditionTypeController>(
    "AdditionTypeController"
  ),
};
