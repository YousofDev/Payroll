import { DependencyInjector } from "./DependencyInjector";
import { PasswordEncoder } from "@util/PasswordEncoder";
import { JwtUtil } from "@util/JwtUtil";
import { UserRepository } from "@app/repository/UserRepository";
import { EmployeeRepository } from "@app/repository/EmployeeRepository";
import { AdditionTypeRepository } from "@app/repository/AdditionTypeRepository";
import { DeductionTypeRepository } from "@app/repository/DeductionTypeRepository";
import { AdditionRepository } from "@app/repository/AdditionRepository";
import { DeductionRepository } from "@app/repository/DeductionRepository";
import { PayslipRepository } from "@app/repository/PayslipRepository";

import { UserService } from "@app/service/UserService";
import { EmployeeService } from "@app/service/EmployeeService";
import { AdditionTypeService } from "@app/service/AdditionTypeService";
import { DeductionTypeService } from "@app/service/DeductionTypeService";
import { AdditionService } from "@app/service/AdditionService";
import { DeductionService } from "@app/service/DeductionService";
import { PayslipService } from "@app/service/PayslipService";

import { UserController } from "@app/controller/UserController";
import { EmployeeController } from "@app/controller/EmployeeController";
import { AdditionTypeController } from "@app/controller/AdditionTypeController";
import { DeductionTypeController } from "@app/controller/DeductionTypeController";
import { AdditionController } from "@app/controller/AdditionController";
import { DeductionController } from "@app/controller/DeductionController";
import { PayslipController } from "@app/controller/PayslipController";

export const container = new DependencyInjector();

container.register("PasswordEncoder", PasswordEncoder, true);
container.register("JwtUtil", JwtUtil, true);
container.register("UserRepository", UserRepository, true);
container.register("UserRepository", UserRepository, true);
container.register("EmployeeRepository", EmployeeRepository, true);
container.register("AdditionTypeRepository", AdditionTypeRepository, true);
container.register("DeductionTypeRepository", DeductionTypeRepository, true);
container.register("AdditionRepository", AdditionRepository, true);
container.register("DeductionRepository", DeductionRepository, true);
container.register("PayslipRepository", PayslipRepository, true);

container.register("UserService", UserService, true);
container.register("EmployeeService", EmployeeService, true);
container.register("AdditionTypeService", AdditionTypeService, true);
container.register("DeductionTypeService", DeductionTypeService, true);
container.register("AdditionService", AdditionService, true);
container.register("DeductionService", DeductionService, true);
container.register("PayslipService", PayslipService, true);

container.register("UserController", UserController);
container.register("EmployeeController", EmployeeController);
container.register("AdditionTypeController", AdditionTypeController);
container.register("DeductionTypeController", DeductionTypeController);
container.register("AdditionController", AdditionController);
container.register("DeductionController", DeductionController);
container.register("PayslipController", PayslipController);
