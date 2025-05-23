import {
  DeductionType,
  DeductionTypeModel,
  NewDeductionTypeModel,
} from "@app/model/DeductionType";
import { DatabaseClient } from "@data/DatabaseClient";
import { NotFoundException } from "@exception/NotFoundException";
import { logger } from "@util/logger";
import { eq } from "drizzle-orm";

export class DeductionTypeRepository {
  private readonly db = DatabaseClient.getInstance().getConnection();

  public constructor() {}

  public async createDeductionType(
    deductionTypeDto: NewDeductionTypeModel
  ): Promise<DeductionTypeModel> {
    const deductionType = await this.db
      .insert(DeductionType)
      .values(deductionTypeDto)
      .returning()
      .then((rows) => rows[0]);

    return deductionType;
  }

  public async getAllDeductionTypes(): Promise<DeductionTypeModel[]> {
    return await this.db.select().from(DeductionType);
  }

  public async getDeductionTypeById(
    deductionTypeId: number
  ): Promise<DeductionTypeModel> {
    return await this.db
      .select()
      .from(DeductionType)
      .where(eq(DeductionType.id, deductionTypeId))
      .then((rows) => rows[0]);
  }

  public async updateDeductionType(
    deductionTypeDto: NewDeductionTypeModel,
    deductionTypeId: number
  ): Promise<DeductionTypeModel> {
    const deductionType = await this.db
      .update(DeductionType)
      .set(deductionTypeDto)
      .where(eq(DeductionType.id, deductionTypeId))
      .returning()
      .then((rows) => rows[0]);

    return deductionType;
  }

  public async deleteDeductionTypeById(deductionTypeId: number): Promise<void> {
    await this.db
      .delete(DeductionType)
      .where(eq(DeductionType.id, deductionTypeId));
  }

  public async getDeductionTypeOrThrowException(deductionTypeId: number) {
    const deductionType = await this.getDeductionTypeById(deductionTypeId);

    if (!deductionType) {
      throw new NotFoundException(
        `Deduction type ID with ${deductionTypeId} does not exists`
      );
    }
    return deductionType;
  }
}
