import {
  Deduction,
  DeductionModel,
  NewDeductionModel,
} from "@app/model/Deduction";
import { DeductionType } from "@app/model/DeductionType";
import { DatabaseClient } from "@data/DatabaseClient";
import { NotFoundException } from "@exception/NotFoundException";
import { logger } from "@util/logger";
import { eq, and, lte, gte, between } from "drizzle-orm";

export class DeductionRepository {
  private readonly db = DatabaseClient.getInstance().getConnection();

  public constructor() {}

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

  public async getAllDeductions() {
    return await this.db
      .select({
        deduction: Deduction,
        deductionType: DeductionType,
      })
      .from(Deduction)
      .innerJoin(
        DeductionType,
        eq(Deduction.deductionTypeId, DeductionType.id)
      );
  }

  public async getDeductionById(deductionId: number) {
    return await this.db
      .select({
        deduction: Deduction,
        deductionType: DeductionType,
      })
      .from(Deduction)
      .innerJoin(DeductionType, eq(Deduction.deductionTypeId, DeductionType.id))
      .where(eq(Deduction.id, deductionId))
      .then((rows) => rows[0]);
  }

  public async getDeductionByDeductionTypeId(
    deductionTypeId: number,
    employeeId: number
  ) {
    return await this.db
      .select({
        deduction: Deduction,
        deductionType: DeductionType,
      })
      .from(Deduction)
      .innerJoin(DeductionType, eq(Deduction.deductionTypeId, DeductionType.id))
      .where(
        and(
          eq(Deduction.deductionTypeId, deductionTypeId),
          eq(Deduction.employeeId, employeeId)
        )
      )
      .then((rows) => rows[0]);
  }

  public async getMonthlyDeductionsByEmployeeId(employeeId: number) {
    return await this.db
      .select({
        id: Deduction.id,
        employeeId: Deduction.employeeId,
        deductionTypeId: Deduction.deductionTypeId,
        frequencyType: DeductionType.frequencyType,
        amount: Deduction.amount,
        name: DeductionType.name,
        description: DeductionType.description,
        metadata: Deduction.metadata,
        createdAt: Deduction.createdAt,
        updatedAt: Deduction.updatedAt,
      })
      .from(Deduction)
      .innerJoin(DeductionType, eq(Deduction.deductionTypeId, DeductionType.id))
      .where(
        and(
          eq(Deduction.employeeId, employeeId),
          eq(DeductionType.frequencyType, "MONTHLY")
        )
      );
  }

  public async getSpecialDeductionsByEmployeeId(
    employeeId: number,
    payPeriodStart: string,
    payPeriodEnd: string
  ) {
    return await this.db
      .select({
        id: Deduction.id,
        employeeId: Deduction.employeeId,
        deductionTypeId: Deduction.deductionTypeId,
        frequencyType: DeductionType.frequencyType,
        amount: Deduction.amount,
        name: DeductionType.name,
        description: DeductionType.description,
        metadata: Deduction.metadata,
        createdAt: Deduction.createdAt,
        updatedAt: Deduction.updatedAt,
      })
      .from(Deduction)
      .innerJoin(DeductionType, eq(Deduction.deductionTypeId, DeductionType.id))
      .where(
        and(
          eq(Deduction.employeeId, employeeId),
          eq(DeductionType.frequencyType, "SPECIAL"),
          gte(Deduction.createdAt, new Date(payPeriodStart)),
          between(
            Deduction.createdAt,
            new Date(payPeriodStart),
            new Date(payPeriodEnd)
          )
        )
      );
  }

  public async updateDeduction(
    deductionDto: Partial<DeductionModel>,
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
