import { Request, Response } from "express";
import { EmployeeService } from "@app/service/EmployeeService";
import { logger } from "@util/logger";
import { validate } from "@util/validate";
import { ResponseEntity } from "@util/ResponseEntity";
import { EmployeeCreateRequestDto } from "@app/dto/EmployeeCreateRequestDto";
import { EmployeeUpdateRequestDto } from "@app/dto/EmployeeUpdateRequestDto";
import { EmployeeIdRequestDto } from "@app/dto/EmployeeIdRequestDto";

export class EmployeeController {
  public constructor(private readonly employeeService: EmployeeService) {}

  public async getAllEmployees(req: Request, res: Response) {
    const employees = await this.employeeService.getAllEmployees();
    ResponseEntity.ok(res, employees);
  }

  public async createEmployee(req: Request, res: Response) {
    const { body } = await validate(EmployeeCreateRequestDto, req);
    const createdEmployee = await this.employeeService.createEmployee(body);
    ResponseEntity.created(res, createdEmployee);
  }

  public async getEmployeeById(req: Request, res: Response) {
    const { params } = await validate(EmployeeIdRequestDto, req);
    const employee = await this.employeeService.getEmployeeById(params.id);
    ResponseEntity.ok(res, employee);
  }

  public async updateEmployee(req: Request, res: Response) {
    const { body, params } = await validate(EmployeeUpdateRequestDto, req);
    const updatedEmployee = await this.employeeService.updateEmployee(
      body,
      params.id
    );
    ResponseEntity.ok(res, updatedEmployee);
  }

  public async deleteEmployeeById(req: Request, res: Response) {
    const { params } = await validate(EmployeeIdRequestDto, req);
    await this.employeeService.deleteEmployeeById(params.id);
    ResponseEntity.noContent(res);
  }
}
