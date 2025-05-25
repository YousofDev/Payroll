import { AdditionModel } from "@app/model/Addition";
import { AdditionTypeModel } from "@app/model/AdditionType";
import { HoursMetadata } from "@data/pgTypes";

export class AdditionResponseDto {
  id: number;
  employeeId: number;
  additionTypeId: number;
  amount: string;
  name: string | undefined;
  frequency: string | undefined;
  description: string | null | undefined;
  metadata: HoursMetadata | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(addition: AdditionModel, additionType?: AdditionTypeModel) {
    this.id = addition.id;
    this.employeeId = addition.employeeId;
    this.additionTypeId = addition.additionTypeId;
    this.amount = addition.amount;
    this.name = additionType?.name;
    this.frequency = additionType?.frequencyType;
    this.description = additionType?.description;
    this.metadata = addition.metadata;
    this.createdAt = addition.createdAt;
    this.updatedAt = addition.updatedAt;
  }
}
