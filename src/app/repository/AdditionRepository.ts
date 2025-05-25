import { Addition, AdditionModel, NewAdditionModel } from "@app/model/Addition";
import { AdditionType } from "@app/model/AdditionType";
import { DatabaseClient } from "@data/DatabaseClient";
import { NotFoundException } from "@exception/NotFoundException";
import { logger } from "@util/logger";
import { and, eq, sql, gte, lte, between } from "drizzle-orm";

interface AdditionDto {
  additionTypeId: number;
  employeeId: number;
  amount: string;
}

export class AdditionRepository {
  private readonly db = DatabaseClient.getInstance().getConnection();

  public constructor() {}

  public async createAddition(
    additionDto: NewAdditionModel
  ): Promise<AdditionModel> {
    const addition = await this.db
      .insert(Addition)
      .values(additionDto)
      .returning()
      .then((rows) => rows[0]);

    return addition;
  }

  public async getAllAdditions() {
    return await this.db
      .select({
        addition: Addition,
        additionType: AdditionType,
      })
      .from(Addition)
      .innerJoin(AdditionType, eq(Addition.additionTypeId, AdditionType.id));
  }

  public async getAllAdditionsByEmployeeId(employeeId: number) {
    return await this.db
      .select({
        addition: Addition,
        additionType: AdditionType,
      })
      .from(Addition)
      .innerJoin(AdditionType, eq(Addition.additionTypeId, AdditionType.id))
      .where(eq(Addition.employeeId, employeeId));
  }

  public async getAdditionById(additionId: number) {
    return await this.db
      .select({
        addition: Addition,
        additionType: AdditionType,
      })
      .from(Addition)
      .innerJoin(AdditionType, eq(Addition.additionTypeId, AdditionType.id))
      .where(eq(Addition.id, additionId))
      .then((rows) => rows[0]);
  }

  public async getAdditionByAdditionTypeId(
    additionTypeId: number,
    employeeId: number
  ) {
    return await this.db
      .select({
        addition: Addition,
        additionType: AdditionType,
      })
      .from(Addition)
      .innerJoin(AdditionType, eq(Addition.additionTypeId, AdditionType.id))
      .where(
        and(
          eq(Addition.additionTypeId, additionTypeId),
          eq(Addition.employeeId, employeeId)
        )
      )
      .then((rows) => rows[0]);
  }

  public async getMonthlyAdditionsByEmployeeId(employeeId: number) {
    return await this.db
      .select({
        employeeId: Addition.employeeId,
        additionTypeId: Addition.additionTypeId,
        frequencyType: AdditionType.frequencyType,
        amount: Addition.amount,
        name: AdditionType.name,
        description: AdditionType.description,
        metadata: Addition.metadata,
        createdAt: Addition.createdAt,
      })
      .from(Addition)
      .innerJoin(AdditionType, eq(Addition.additionTypeId, AdditionType.id))
      .where(
        and(
          eq(Addition.employeeId, employeeId),
          eq(AdditionType.frequencyType, "MONTHLY")
        )
      );
  }

  public async getSpecialAdditionsByEmployeeId(
    employeeId: number,
    payPeriodStart: string,
    payPeriodEnd: string
  ) {
    return await this.db
      .select({
        employeeId: Addition.employeeId,
        additionTypeId: Addition.additionTypeId,
        frequencyType: AdditionType.frequencyType,
        amount: Addition.amount,
        name: AdditionType.name,
        description: AdditionType.description,
        metadata: Addition.metadata,
        createdAt: Addition.createdAt,
      })
      .from(Addition)
      .innerJoin(AdditionType, eq(Addition.additionTypeId, AdditionType.id))
      .where(
        and(
          eq(Addition.employeeId, employeeId),
          eq(AdditionType.frequencyType, "SPECIAL"),
          between(
            Addition.createdAt,
            new Date(payPeriodStart),
            new Date(payPeriodEnd)
          )
        )
      );
  }

  public async updateAddition(
    additionDto: Partial<AdditionModel>,
    additionId: number
  ): Promise<AdditionModel> {
    const addition = await this.db
      .update(Addition)
      .set(additionDto)
      .where(eq(Addition.id, additionId))
      .returning()
      .then((rows) => rows[0]);

    return addition;
  }

  public async deleteAdditionById(additionId: number): Promise<void> {
    const result = await this.db
      .delete(Addition)
      .where(eq(Addition.id, additionId))
      .returning();
    if (result.length == 0) {
      throw new NotFoundException(
        `addition ID with ${additionId} does not exists`
      );
    }
  }

  public async getAdditionOrThrowException(additionId: number) {
    const result = await this.getAdditionById(additionId);

    if (!result) {
      throw new NotFoundException(
        `addition ID with ${additionId} does not exists`
      );
    }

    return result;
  }
}
