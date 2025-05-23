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

container.register(PasswordEncoder, true);
container.register(JwtUtil, true);
container.register(UserRepository, true);
container.register(UserRepository, true);
container.register(EmployeeRepository, true);
container.register(AdditionTypeRepository, true);
container.register(DeductionTypeRepository, true);
container.register(AdditionRepository, true);
container.register(DeductionRepository, true);
container.register(PayslipRepository, true);

container.register(UserService, true);
container.register(EmployeeService, true);
container.register(AdditionTypeService, true);
container.register(DeductionTypeService, true);
container.register(AdditionService, true);
container.register(DeductionService, true);
container.register(PayslipService, true);

container.register(UserController);
container.register(EmployeeController);
container.register(AdditionTypeController);
container.register(DeductionTypeController);
container.register(AdditionController);
container.register(DeductionController);
container.register(PayslipController);
