import {
  AdditionType,
  AdditionTypeModel,
  NewAdditionTypeModel,
} from "@app/model/AdditionType";
import { DatabaseClient } from "@data/DatabaseClient";
import { NotFoundException } from "@exception/NotFoundException";
import { logger } from "@util/logger";
import { eq } from "drizzle-orm";

export class AdditionTypeRepository {
  private readonly db = DatabaseClient.getInstance().getConnection();

  public constructor() {}

  public async createAdditionType(
    additionTypeDto: NewAdditionTypeModel
  ): Promise<AdditionTypeModel> {
    const additionType = await this.db
      .insert(AdditionType)
      .values(additionTypeDto)
      .returning()
      .then((rows) => rows[0]);

    return additionType;
  }

  public async getAllAdditionTypes(): Promise<AdditionTypeModel[]> {
    return await this.db.select().from(AdditionType);
  }

  public async getAdditionTypeById(
    additionTypeId: number
  ): Promise<AdditionTypeModel> {
    return await this.db
      .select()
      .from(AdditionType)
      .where(eq(AdditionType.id, additionTypeId))
      .then((rows) => rows[0]);
  }

  public async updateAdditionType(
    additionTypeDto: NewAdditionTypeModel,
    additionTypeId: number
  ): Promise<AdditionTypeModel> {
    const additionType = await this.db
      .update(AdditionType)
      .set(additionTypeDto)
      .where(eq(AdditionType.id, additionTypeId))
      .returning()
      .then((rows) => rows[0]);

    return additionType;
  }

  public async deleteAdditionTypeById(additionTypeId: number): Promise<void> {
    await this.db
      .delete(AdditionType)
      .where(eq(AdditionType.id, additionTypeId));
  }

  public async getAdditionTypeOrThrowException(additionTypeId: number) {
    const additionType = await this.getAdditionTypeById(additionTypeId);

    if (!additionType) {
      throw new NotFoundException(
        `Addition type ID with ${additionTypeId} does not exists`
      );
    }
    return additionType;
  }
}
