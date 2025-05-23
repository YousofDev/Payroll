import { EmployeeRepository } from "@app/repository/EmployeeRepository";
import { PayslipRepository } from "@app/repository/PayslipRepository";
import { logger } from "@util/logger";
import { AdditionRepository } from "@app/repository/AdditionRepository";
import { DeductionRepository } from "@app/repository/DeductionRepository";
import { PayslipCreateRequestDtoType } from "@app/dto/PayslipCreateRequestDto";
import { PreparedPayslipType } from "@app/dto/PreparedPayslipType";
import { PayslipResponseDto } from "@app/dto/PayslipResponseDto";
import { BusinessException } from "@exception/BusinessException";

interface PayslipGenerationResult {
  success: PayslipResponseDto[];
  errors: Array<{
    employeeId: number;
    error: string;
  }>;
}

export class PayslipService {
  public constructor(
    private readonly payslipRepository: PayslipRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly additionRepository: AdditionRepository,
    private readonly deductionRepository: DeductionRepository
  ) {
  }

  public async generatePayslips(
    payslipDto: PayslipCreateRequestDtoType
  ): Promise<PayslipGenerationResult> {
    // Ensure there is no payslips for the any employee through pay period
    await this.payslipRepository.validatePayslipPeriodForEmployees(payslipDto);

    const result: PayslipGenerationResult = {
      success: [],
      errors: [],
    };

    // Process each employee
    for (const employeeId of payslipDto.employeeIds) {
      try {
        const payslip = await this.generateSinglePayslip(
          employeeId,
          payslipDto
        );
        result.success.push(payslip);
      } catch (error) {
        logger.error(
          `Error generating payslip for employee ${employeeId}:`,
          error
        );
        result.errors.push({
          employeeId,
          error:
            error instanceof BusinessException
              ? error.message
              : "Unknown error occurred",
        });
      }
    }

    return result;
  }

  private async generateSinglePayslip(
    employeeId: number,
    payslipDto: PayslipCreateRequestDtoType
  ) {
    // 1- find employee by id
    const employee =
      await this.employeeRepository.getEmployeeOrThrowException(employeeId);

    // 2- find MONTHLY additions by employee id
    const monthlyAdditions =
      (await this.additionRepository.getMonthlyAdditionsByEmployeeId(
        employee.id
      )) || [];

    // 3- find SPECIAL additions by employee id and payPeriodStart, payPeriodEnd
    const specialAdditions =
      (await this.additionRepository.getSpecialAdditionsByEmployeeId(
        employee.id,
        payslipDto.payPeriodStart,
        payslipDto.payPeriodEnd
      )) || [];

    // 4- find MONTHLY deductions by employee id
    const monthlyDeductions =
      (await this.deductionRepository.getMonthlyDeductionsByEmployeeId(
        employee.id
      )) || [];

    // 5- find SPECIAL deductions by employee id and payPeriodStart, payPeriodEnd
    const specialDeductions =
      (await this.deductionRepository.getSpecialDeductionsByEmployeeId(
        employee.id,
        payslipDto.payPeriodStart,
        payslipDto.payPeriodEnd
      )) || [];

    // 7- calculate basic salary, total additions, total deductions, net salary
    const basicSalary = Number(employee.salary);

    const totalAdditions =
      this.calculateTotal(monthlyAdditions) +
      this.calculateTotal(specialAdditions);

    const totalDeductions =
      this.calculateTotal(monthlyDeductions) +
      this.calculateTotal(specialDeductions);

    const netSalary = basicSalary + totalAdditions - totalDeductions;

    // Prepare payslip object
    const payslip: PreparedPayslipType = {
      employeeId: employee.id,
      employeeName: employee.firstName + " " + employee.lastName,
      payPeriodStart: payslipDto.payPeriodStart,
      payPeriodEnd: payslipDto.payPeriodEnd,
      payslipStatus: payslipDto.payslipStatus,
      basicSalary: basicSalary.toString(),
      totalAdditions: totalAdditions.toString(),
      totalDeductions: totalDeductions.toString(),
      netSalary: netSalary.toString(),
      companyName: payslipDto.companyName,
      companyAddress: payslipDto.companyAddress,
      companyLogo: payslipDto.companyLogo || null,
      additions: [...monthlyAdditions, ...specialAdditions],
      deductions: [...monthlyDeductions, ...specialDeductions],
    };

    return await this.payslipRepository.createPayslip(payslip);
  }

  private calculateTotal(items: any[]): number {
    return items.reduce((total, add) => total + (Number(add.amount) || 0), 0);
  }

  public async getAllPayslips() {
    return await this.payslipRepository.getAllPayslips();
  }

  public async getPayslipById(payslipId: number) {
    return await this.payslipRepository.getPayslipById(payslipId);
  }

  public async deletePayslipById(payslipId: number): Promise<void> {
    await this.payslipRepository.getPayslipOrThrowException(payslipId);
    await this.payslipRepository.deletePayslipById(payslipId);
  }
}
