import { DeductionTypeModel } from "@app/model/DeductionType";

export class DeductionTypeResponseDto {
  id: number;
  name: string;
  description: string | null;
  frequencyType: "MONTHLY" | "SPECIAL";
  createdAt: Date;
  updatedAt: Date;

  constructor(additionType: DeductionTypeModel) {
    this.id = additionType.id;
    this.name = additionType.name;
    this.description = additionType.description;
    this.frequencyType = additionType.frequencyType;
    this.createdAt = additionType.createdAt;
    this.updatedAt = additionType.updatedAt;
  }
}
