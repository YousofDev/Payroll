interface Additions {
  name: string;
  amount: string;
  employeeId: number;
  additionTypeId: number
  createdAt: Date;
}

interface Deductions {
  name: string;
  amount: string;
  employeeId: number;
  deductionTypeId: number
  createdAt: Date;
}

export interface PreparedPayslipType {
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
  additions: Additions[];
  deductions: Deductions[];
}
