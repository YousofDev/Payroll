import {
  Deduction,
  DeductionModel,
  NewDeductionModel,
} from "@app/model/Deduction";
import { DatabaseClient } from "@data/DatabaseClient";
import { NotFoundException } from "@exception/NotFoundException";
import { logger } from "@util/logger";
import { eq } from "drizzle-orm";

export class DeductionRepository {
  private readonly db = DatabaseClient.getInstance().getConnection();

  public constructor() {
    logger.info("DeductionRepository initialized");
  }

  public async createDeduction(
    deductionDto: NewDeductionModel
  ): Promise<DeductionModel> {
    const deduction = await this.db
      .insert(Deduction)
      .values(deductionDto)
      .returning()
      .then((rows) => rows[0]);

    return deduction;
  }

  public async getAllDeductions(): Promise<DeductionModel[]> {
    return await this.db.select().from(Deduction);
  }

  public async getDeductionById(deductionId: number): Promise<DeductionModel> {
    return await this.db
      .select()
      .from(Deduction)
      .where(eq(Deduction.id, deductionId))
      .then((rows) => rows[0]);
  }

  public async updateDeduction(
    deductionDto: NewDeductionModel,
    deductionId: number
  ): Promise<DeductionModel> {
    const deduction = await this.db
      .update(Deduction)
      .set(deductionDto)
      .where(eq(Deduction.id, deductionId))
      .returning()
      .then((rows) => rows[0]);

    return deduction;
  }

  public async deleteDeductionById(deductionId: number): Promise<void> {
    await this.db.delete(Deduction).where(eq(Deduction.id, deductionId));
  }

  public async getDeductionOrThrowException(deductionId: number) {
    const deduction = await this.getDeductionById(deductionId);

    if (!deduction) {
      throw new NotFoundException(
        `Deduction ID with ${deductionId} does not exists`
      );
    }
    return deduction;
  }
}
