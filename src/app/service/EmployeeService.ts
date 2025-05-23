import { EmployeeResponseDto } from "@app/dto/EmployeeResponseDto";
import { NewEmployeeModel, EmployeeModel } from "@app/model/Employee";
import { EmployeeRepository } from "@app/repository/EmployeeRepository";
import { NotFoundException } from "@exception/NotFoundException";
import { logger } from "@util/logger";

export class EmployeeService {
  public constructor(private readonly employeeRepository: EmployeeRepository) {}

  public async getAllEmployees() {
    const employees = await this.employeeRepository.getAllEmployees();
    return employees.map((emp) => new EmployeeResponseDto(emp));
  }

  public async createEmployee(employeeDto: NewEmployeeModel) {
    const employee = await this.employeeRepository.createEmployee(employeeDto);
    return new EmployeeResponseDto(employee);
  }

  public async getEmployeeById(employeeId: number) {
    const employee =
      await this.employeeRepository.getEmployeeOrThrowException(employeeId);
    return new EmployeeResponseDto(employee);
  }

  public async updateEmployee(
    employeeDto: NewEmployeeModel,
    employeeId: number
  ) {
    let employee =
      await this.employeeRepository.getEmployeeOrThrowException(employeeId);
    employee = await this.employeeRepository.updateEmployee(
      employeeDto,
      employeeId
    );
    return employee;
  }

  public async deleteEmployeeById(employeeId: number) {
    await this.employeeRepository.getEmployeeOrThrowException(employeeId);
    await this.employeeRepository.deleteEmployeeById(employeeId);
  }
}
