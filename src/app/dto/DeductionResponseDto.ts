import { DeductionModel } from "@app/model/Deduction";

interface DeductionDetails {
  id: number;
  employeeId: number;
  deductionTypeId: number;
  amount: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class DeductionResponseDto {
  id: number;
  employeeId: number;
  deductionTypeId: number;
  amount: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(deduction: DeductionDetails) {
    this.id = deduction.id;
    this.employeeId = deduction.employeeId;
    this.deductionTypeId = deduction.deductionTypeId;
    this.amount = deduction.amount;
    this.name = deduction.name;
    this.description = deduction.description;
    this.createdAt = deduction.createdAt;
    this.updatedAt = deduction.updatedAt;
  }
}
