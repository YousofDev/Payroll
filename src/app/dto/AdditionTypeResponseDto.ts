import { AdditionTypeModel } from "@app/model/AdditionType";

export class AdditionTypeResponseDto {
  id: number;
  name: string;
  description: string | null;
  frequencyType: "MONTHLY" | "SPECIAL";
  createdAt: Date;
  updatedAt: Date;

  constructor(additionType: AdditionTypeModel) {
    this.id = additionType.id;
    this.name = additionType.name;
    this.description = additionType.description;
    this.frequencyType = additionType.frequencyType;
    this.createdAt = additionType.createdAt;
    this.updatedAt = additionType.updatedAt;
  }
}
