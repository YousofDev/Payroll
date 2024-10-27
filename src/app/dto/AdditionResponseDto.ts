import { AdditionModel } from "@app/model/Addition";

interface AdditionDetails {
  id: number;
  employeeId: number;
  additionTypeId: number;
  amount: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class AdditionResponseDto {
  id: number;
  employeeId: number;
  additionTypeId: number;
  amount: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(addition: AdditionDetails) {
    this.id = addition.id;
    this.employeeId = addition.employeeId;
    this.additionTypeId = addition.additionTypeId;
    this.amount = addition.amount;
    this.name = addition.name;
    this.description = addition.description;
    this.createdAt = addition.createdAt;
    this.updatedAt = addition.updatedAt;
  }
}
