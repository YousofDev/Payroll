import { EmployeeRepository } from "@app/repository/EmployeeRepository";
import { PayslipRepository } from "@app/repository/PayslipRepository";
import { logger } from "@util/logger";
import { AdditionRepository } from "@app/repository/AdditionRepository";
import { DeductionRepository } from "@app/repository/DeductionRepository";
import { PayslipCreateRequestDtoType } from "@app/dto/PayslipCreateRequestDto";
import {
  NewPayslipItemModel,
  NewPayslipModel,
  PayslipItemModel,
  PayslipModel,
} from "@app/model/Payslip";
import { PreparedPayslipType } from "@app/dto/PreparedPayslipType";
import { DatabaseClient } from "@data/DatabaseClient";

export class PayslipService {
  private readonly db = DatabaseClient.getInstance().getConnection();

  public constructor(
    private readonly payslipRepository: PayslipRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly additionRepository: AdditionRepository,
    private readonly deductionRepository: DeductionRepository
  ) {
    logger.info("PayslipService initialized");
  }

  public async generatePayslip(payslipDto: PayslipCreateRequestDtoType) {
    // 1- find employee by id
    const employee = await this.employeeRepository.getEmployeeOrThrowException(
      payslipDto.employeeId
    );

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

    const newPayslip = await this.payslipRepository.generatePayslip(payslip);

    return newPayslip;
  }

  private calculateTotal(items: any[]): number {
    return items.reduce((total, add) => total + (Number(add.amount) || 0), 0);
  }

  public async getPayslipById(payslipId: number) {
    return await this.payslipRepository.getPayslipById(payslipId);
  }

  public async deletePayslipById(payslipId: number): Promise<void> {
    await this.payslipRepository.getPayslipOrThrowException(payslipId);
    await this.payslipRepository.deletePayslipById(payslipId);
  }
}
