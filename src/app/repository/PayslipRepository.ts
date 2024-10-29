import { eq, sql } from "drizzle-orm";
import {
  PayslipItemResponseDto,
  PayslipResponseDto,
} from "@app/dto/PayslipResponseDto";
import { PayslipCreateRequestDto } from "@app/dto/PayslipCreateRequestDto";
import {
  Payslip,
  PayslipModel,
  NewPayslipModelWithItems,
  PayslipModelWithItems,
  PayslipItem,
  PayslipItemModel,
  NewPayslipItemModel,
} from "@app/model/Payslip";
import { DatabaseClient } from "@data/DatabaseClient";
import { NotFoundException } from "@exception/NotFoundException";
import { logger } from "@util/logger";

import { PreparedPayslipType } from "@app/dto/PreparedPayslipType";
import { Direction } from "@data/pgEnums";

export class PayslipRepository {
  private readonly db = DatabaseClient.getInstance().getConnection();

  public constructor() {
    logger.info("PayslipRepository initialized");
  }

  public async generatePayslip(payslip: PreparedPayslipType) {
    return await this.db.transaction(async (trx) => {
      // Insert the payslip record
      const newPayslip = await trx
        .insert(Payslip)
        .values(payslip)
        .returning()
        .then((rows) => rows[0]);

      // Map additions and deductions
      const payslipItems = [
        ...payslip.additions.map((item) => ({
          ...item,
          payslipId: newPayslip.id,
          direction: Direction.enumValues[0],
        })),
        ...payslip.deductions.map((item) => ({
          ...item,
          payslipId: newPayslip.id,
          direction: Direction.enumValues[1],
        })),
      ];

      // Insert payslip items within the same transaction
      const newPayslipItems = await trx
        .insert(PayslipItem)
        .values(payslipItems)
        .returning();

      // Separate additions and deductions for response
      const additions = newPayslipItems.filter(
        (item) => item.direction === Direction.enumValues[0]
      );
      const deductions = newPayslipItems.filter(
        (item) => item.direction === Direction.enumValues[1]
      );

      return new PayslipResponseDto(newPayslip, additions, deductions);
    });
  }

  public async createPayslip(payslip: PreparedPayslipType) {
    const newPayslip = await this.db
      .insert(Payslip)
      .values(payslip)
      .returning()
      .then((rows) => rows[0]);

    // Map additions and deductions
    const payslipAdditions = payslip.additions?.length
      ? payslip.additions.map((item) => ({
          ...item,
          payslipId: newPayslip.id,
          direction: Direction.enumValues[0],
        }))
      : [];

    const payslipDeductions = payslip.deductions?.length
      ? payslip.deductions.map((item) => ({
          ...item,
          payslipId: newPayslip.id,
          direction: Direction.enumValues[1],
        }))
      : [];

    // Combine items only if they are non-empty
    const items = [...payslipAdditions, ...payslipDeductions];
    if (items.length) {
      const newPayslipItems = await this.db
        .insert(PayslipItem)
        .values(items)
        .returning();

      const additions = newPayslipItems.filter(
        (item) => item.direction == Direction.enumValues[0]
      );
      const deductions = newPayslipItems.filter(
        (item) => item.direction == Direction.enumValues[1]
      );

      return new PayslipResponseDto(newPayslip, additions, deductions);
    }

    // Return empty additions and deductions if no items were added
    return new PayslipResponseDto(newPayslip, [], []);
  }

  public async getAllPayslips() {
    const payslips = await this.db.select().from(Payslip).execute();

    const payslipItems = await this.db
      .select()
      .from(PayslipItem)
      .where(sql`${PayslipItem.payslipId} IN ${payslips.map((p) => p.id)}`)
      .execute();

    const payslipItemsMap = payslipItems.reduce(
      (map, item) => {
        if (!map[item.payslipId]) {
          map[item.payslipId] = [];
        }
        map[item.payslipId].push(new PayslipItemResponseDto(item));
        return map;
      },
      {} as Record<number, PayslipItemResponseDto[]>
    );

    // return payslips.map(
    //   (payslip) =>
    //     new PayslipResponseDto(payslip, payslipItemsMap[payslip.id] || [])
    // );
  }

  public async getPayslipById(payslipId: number) {
    const payslip = await this.getPayslipOrThrowException(payslipId);

    const payslipItems = await this.db
      .select()
      .from(PayslipItem)
      .where(eq(PayslipItem.payslipId, payslipId));

    const additions = payslipItems.filter(
      (item) => item.direction == Direction.enumValues[0]
    );

    const deductions = payslipItems.filter(
      (item) => item.direction == Direction.enumValues[1]
    );

    return new PayslipResponseDto(payslip, additions, deductions);
  }

  public async deletePayslipById(payslipId: number): Promise<void> {
    await this.db.delete(Payslip).where(eq(Payslip.id, payslipId));
  }

  public async getPayslipOrThrowException(payslipId: number) {
    const payslip = await this.db
      .select()
      .from(Payslip)
      .where(eq(Payslip.id, payslipId))
      .then((rows) => rows[0]);

    if (!payslip) {
      throw new NotFoundException(
        `Payslip ID with ${payslipId} does not exists`
      );
    }
    return payslip;
  }
}
