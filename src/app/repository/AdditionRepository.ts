import { Addition, AdditionModel, NewAdditionModel } from "@app/model/Addition";
import { AdditionType } from "@app/model/AdditionType";
import { DatabaseClient } from "@data/DatabaseClient";
import { Direction, FrequencyType } from "@data/pgEnums";
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
    additionDto: AdditionDto
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
        id: Addition.id,
        employeeId: Addition.employeeId,
        additionTypeId: Addition.additionTypeId,
        frequencyType: AdditionType.frequencyType,
        amount: Addition.amount,
        name: AdditionType.name,
        description: AdditionType.description,
        createdAt: Addition.createdAt,
        updatedAt: Addition.updatedAt,
      })
      .from(Addition)
      .innerJoin(AdditionType, eq(Addition.additionTypeId, AdditionType.id));
  }

  public async getAllAdditionsByEmployeeId(employeeId: number) {
    return await this.db
      .select({
        id: Addition.id,
        employeeId: Addition.employeeId,
        additionTypeId: Addition.additionTypeId,
        frequencyType: AdditionType.frequencyType,
        amount: Addition.amount,
        name: AdditionType.name,
        description: AdditionType.description,
        createdAt: Addition.createdAt,
        updatedAt: Addition.updatedAt,
      })
      .from(Addition)
      .innerJoin(AdditionType, eq(Addition.additionTypeId, AdditionType.id))
      .where(eq(Addition.employeeId, employeeId));
  }

  public async getAdditionById(additionId: number) {
    return await this.db
      .select({
        id: Addition.id,
        employeeId: Addition.employeeId,
        additionTypeId: Addition.additionTypeId,
        frequencyType: AdditionType.frequencyType,
        amount: Addition.amount,
        name: AdditionType.name,
        description: AdditionType.description,
        createdAt: Addition.createdAt,
        updatedAt: Addition.updatedAt,
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
        frequencyType: AdditionType.frequencyType,
        name: AdditionType.name,
        description: AdditionType.description,
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
        name: AdditionType.name,
        amount: Addition.amount,
        employeeId: Addition.employeeId,
        additionTypeId: Addition.additionTypeId,
        frequencyType: AdditionType.frequencyType,
        createdAt: Addition.createdAt,
        // direction: sql`${Direction.enumValues[0]}`,
      })
      .from(Addition)
      .innerJoin(AdditionType, eq(Addition.additionTypeId, AdditionType.id))
      .where(
        and(
          eq(Addition.employeeId, employeeId),
          eq(AdditionType.frequencyType, FrequencyType.enumValues[0])
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
        name: AdditionType.name,
        amount: Addition.amount,
        employeeId: Addition.employeeId,
        additionTypeId: Addition.additionTypeId,
        frequencyType: AdditionType.frequencyType,
        createdAt: Addition.createdAt,
      })
      .from(Addition)
      .innerJoin(AdditionType, eq(Addition.additionTypeId, AdditionType.id))
      .where(
        and(
          eq(Addition.employeeId, employeeId),
          eq(AdditionType.frequencyType, FrequencyType.enumValues[1]),
          between(
            Addition.createdAt,
            new Date(payPeriodStart),
            new Date(payPeriodEnd)
          )
        )
      );
  }

  public async updateAddition(
    additionDto: NewAdditionModel,
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
    await this.db.delete(Addition).where(eq(Addition.id, additionId));
  }

  public async getAdditionOrThrowException(additionId: number) {
    const addition = await this.getAdditionById(additionId);

    if (!addition) {
      throw new NotFoundException(
        `addition ID with ${additionId} does not exists`
      );
    }
    return addition;
  }
}
