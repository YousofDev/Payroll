import { DependencyService } from "./DependencyService";
import { EmployeeRepository } from "@app/repository/EmployeeRepository";
import { AdditionTypeRepository } from "@app/repository/AdditionTypeRepository";
import { DeductionTypeRepository } from "@app/repository/DeductionTypeRepository";
import { AdditionRepository } from "@app/repository/AdditionRepository";
import { DeductionRepository } from "@app/repository/DeductionRepository";

import { EmployeeService } from "@app/service/EmployeeService";
import { AdditionTypeService } from "@app/service/AdditionTypeService";
import { DeductionTypeService } from "@app/service/DeductionTypeService";
import { AdditionService } from "@app/service/AdditionService";
import { DeductionService } from "@app/service/DeductionService";

import { EmployeeController } from "@app/controller/EmployeeController";
import { AdditionTypeController } from "@app/controller/AdditionTypeController";
import { DeductionTypeController } from "@app/controller/DeductionTypeController";
import { AdditionController } from "@app/controller/AdditionController";
import { DeductionController } from "@app/controller/DeductionController";

export const container = new DependencyService();

container.register("EmployeeRepository", EmployeeRepository, true);
container.register("AdditionTypeRepository", AdditionTypeRepository, true);
container.register("DeductionTypeRepository", DeductionTypeRepository, true);
container.register("AdditionRepository", AdditionRepository, true);
container.register("DeductionRepository", DeductionRepository, true);

container.register("EmployeeService", EmployeeService, true);
container.register("AdditionTypeService", AdditionTypeService, true);
container.register("DeductionTypeService", DeductionTypeService, true);
container.register("AdditionService", AdditionService, true);
container.register("DeductionService", DeductionService, true);

container.register("EmployeeController", EmployeeController);
container.register("AdditionTypeController", AdditionTypeController);
container.register("DeductionTypeController", DeductionTypeController);
container.register("AdditionController", AdditionController);
container.register("DeductionController", DeductionController);
