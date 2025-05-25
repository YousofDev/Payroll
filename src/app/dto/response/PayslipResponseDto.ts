import { PayslipItemModel, PayslipModel } from "@app/model/Payslip";
import { Direction, HoursMetadata } from "@data/pgTypes";

export class PayslipItemResponseDto {
  id: number;
  payslipId: number;
  amount: string;
  name: string;
  description: string | null;
  metadata: HoursMetadata | null;
  direction: "ADDITION" | "DEDUCTION";

  constructor(item: PayslipItemModel) {
    this.id = item.id;
    this.payslipId = item.payslipId;
    this.amount = item.amount;
    this.name = item.name;
    this.description = item.description;
    this.metadata = item.metadata;
    this.direction = item.direction;
  }
}

export class PayslipResponseDto {
  id: number;
  employeeId: number;
  employeeName: string;
  payPeriodStart: string;
  payPeriodEnd: string;
  payslipStatus: "DRAFT" | "PROCESSED" | "PAID";
  basicSalary: string;
  totalAdditions: string;
  totalDeductions: string;
  netSalary: string;
  companyName: string;
  companyAddress: string;
  companyLogo: string | null;
  createdAt: Date;
  updatedAt: Date;
  additions: PayslipItemResponseDto[];
  deductions: PayslipItemResponseDto[];

  constructor(
    payslip: PayslipModel,
    additions: PayslipItemModel[],
    deductions: PayslipItemModel[]
  ) {
    this.id = payslip.id;
    this.employeeId = payslip.employeeId;
    this.employeeName = payslip.employeeName;
    this.payPeriodStart = payslip.payPeriodStart;
    this.payPeriodEnd = payslip.payPeriodEnd;
    this.payslipStatus = payslip.payslipStatus;
    this.basicSalary = payslip.basicSalary;
    this.totalAdditions = payslip.totalAdditions;
    this.totalDeductions = payslip.totalDeductions;
    this.netSalary = payslip.netSalary;
    this.createdAt = payslip.createdAt;
    this.updatedAt = payslip.updatedAt;
    this.companyName = payslip.companyName;
    this.companyAddress = payslip.companyAddress;
    this.companyLogo = payslip.companyLogo;
    this.additions = additions.map((item) => new PayslipItemResponseDto(item));
    this.deductions = deductions.map(
      (item) => new PayslipItemResponseDto(item)
    );
  }
}
