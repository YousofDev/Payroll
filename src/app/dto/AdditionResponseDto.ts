import { AdditionModel } from "@app/model/Addition";

export class AdditionResponseDto {
  id: number;
  additionTypeId: number;
  employeeId: number;
  amount: string;
  frequencyType: "MONTHLY" | "SPECIAL";
  createdAt: Date;
  updatedAt: Date;

  constructor(addition: AdditionModel) {
    this.id = addition.id;
    this.additionTypeId = addition.additionTypeId;
    this.employeeId = addition.employeeId;
    this.amount = addition.amount;
    this.frequencyType = addition.frequencyType;
    this.createdAt = addition.createdAt;
    this.updatedAt = addition.updatedAt;
  }
}
