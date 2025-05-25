import { DeductionModel } from "@app/model/Deduction";
import { DeductionTypeModel } from "@app/model/DeductionType";
import { HoursMetadata } from "@data/pgTypes";

export class DeductionResponseDto {
  id: number;
  employeeId: number;
  deductionTypeId: number;
  amount: string;
  name: string;
  frequency: string | undefined;
  description: string | null | undefined;
  metadata: HoursMetadata | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(deduction: DeductionModel, deductionType: DeductionTypeModel) {
    this.id = deduction.id;
    this.employeeId = deduction.employeeId;
    this.deductionTypeId = deduction.deductionTypeId;
    this.amount = deduction.amount;
    this.name = deductionType?.name;
    this.frequency = deductionType?.frequencyType;
    this.description = deductionType?.description;
    this.metadata = deduction.metadata;
    this.createdAt = deduction.createdAt;
    this.updatedAt = deduction.updatedAt;
  }
}
