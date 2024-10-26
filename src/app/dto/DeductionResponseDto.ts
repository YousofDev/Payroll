import { DeductionModel } from "@app/model/Deduction";

export class DeductionResponseDto {
  id: number;
  deductionTypeId: number;
  employeeId: number;
  amount: string;
  frequencyType: "MONTHLY" | "SPECIAL";
  createdAt: Date;
  updatedAt: Date;

  constructor(deduction: DeductionModel) {
    this.id = deduction.id;
    this.deductionTypeId = deduction.deductionTypeId;
    this.employeeId = deduction.employeeId;
    this.amount = deduction.amount;
    this.frequencyType = deduction.frequencyType;
    this.createdAt = deduction.createdAt;
    this.updatedAt = deduction.updatedAt;
  }
}
