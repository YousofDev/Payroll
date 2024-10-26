import { Addition, AdditionModel, NewAdditionModel } from "@app/model/Addition";
import { DatabaseClient } from "@data/DatabaseClient";
import { NotFoundException } from "@exception/NotFoundException";
import { logger } from "@util/logger";
import { eq } from "drizzle-orm";

export class AdditionRepository {
  private readonly db = DatabaseClient.getInstance().getConnection();

  public constructor() {
    logger.info("AdditionRepository initialized");
  }

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

  public async getAllAdditions(): Promise<AdditionModel[]> {
    return await this.db.select().from(Addition);
  }

  public async getAdditionById(additionId: number): Promise<AdditionModel> {
    return await this.db
      .select()
      .from(Addition)
      .where(eq(Addition.id, additionId))
      .then((rows) => rows[0]);
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
