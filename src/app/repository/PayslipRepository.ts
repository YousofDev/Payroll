import { eq, and, between, inArray, sql } from "drizzle-orm";
import {
  PayslipItemResponseDto,
  PayslipResponseDto,
} from "@app/dto/response/PayslipResponseDto";
import { PayslipCreateRequestDtoType } from "@app/dto/request/PayslipCreateRequestDto";
import { Payslip, PayslipItem, PayslipItemModel } from "@app/model/Payslip";
import { DatabaseClient } from "@data/DatabaseClient";
import { NotFoundException } from "@exception/NotFoundException";
import { logger } from "@util/logger";
import { DirectionType } from "@config/constants";

import { PreparedPayslipType } from "@app/dto/internal/PreparedPayslipType";
import { Direction } from "@data/pgTypes";
import { DatabaseException } from "@exception/DatabaseException";
import { BadRequestException } from "@exception/BadRequestException";

export class PayslipRepository {
  private readonly db = DatabaseClient.getInstance().getConnection();

  public constructor() {}

  /**
   * Creates a new payslip with its items in a transaction
   */
  public async createPayslip(payslip: PreparedPayslipType) {
    try {
      return await this.db.transaction(async (trx) => {
        // Insert the payslip record
        const [newPayslip] = await trx
          .insert(Payslip)
          .values(payslip)
          .returning();

        // Prepare payslip items
        const payslipItems = this.preparePayslipItems(payslip, newPayslip.id);

        // Insert payslip items if any exist
        let newPayslipItems: PayslipItemModel[] = [];
        if (payslipItems.length > 0) {
          newPayslipItems = await trx
            .insert(PayslipItem)
            .values(payslipItems)
            .returning();
        }

        // Separate items by direction for the response
        const additions = newPayslipItems.filter(
          (item) => item.direction === Direction.enumValues[0]
        );
        const deductions = newPayslipItems.filter(
          (item) => item.direction === Direction.enumValues[1]
        );

        return { newPayslip, additions, deductions };
      });
    } catch (error) {
      logger.error("Error creating payslip:", error);
      throw new DatabaseException("Failed to create payslip");
    }
  }

  /**
   * Prepares payslip items for insertion
   */
  private preparePayslipItems(payslip: PreparedPayslipType, payslipId: number) {
    const additionItems = (payslip.additions || []).map((item) => ({
      amount: item.amount,
      name: item.name,
      metadata: item.metadata,
      description: item.description,
      employeeId: item.employeeId,
      additionTypeId: item.additionTypeId,
      createdAt: item.createdAt,
      payslipId,
      direction: Direction.enumValues[0],
    }));

    const deductionItems = (payslip.deductions || []).map((item) => ({
      amount: item.amount,
      name: item.name,
      metadata: item.metadata,
      description: item.description,
      employeeId: item.employeeId,
      deductionTypeId: item.deductionTypeId,
      createdAt: item.createdAt,
      payslipId,
      direction: Direction.enumValues[1],
    }));

    return [...additionItems, ...deductionItems];
  }

  /**
   * Validates the payslip period for multiple employees to prevent duplicates
   */
  public async validatePayslipPeriodForEmployees(
    payslipDto: PayslipCreateRequestDtoType
  ): Promise<void> {
    const existingPayslips = await this.db
      .select()
      .from(Payslip)
      .where(
        and(
          inArray(Payslip.employeeId, payslipDto.employeeIds),
          between(
            Payslip.payPeriodStart,
            payslipDto.payPeriodStart,
            payslipDto.payPeriodEnd
          ),
          between(
            Payslip.payPeriodEnd,
            payslipDto.payPeriodStart,
            payslipDto.payPeriodEnd
          )
        )
      );

    if (existingPayslips.length > 0) {
      const employeeIds = existingPayslips.map((p) => p.employeeId).join(", ");
      throw new BadRequestException(
        `Payslips already exist for employees ${employeeIds} in the specified period`
      );
    }
  }

  public async getAllPayslips() {
    // Fetch all payslips with their related items
    const payslipsWithItems = await this.db
      .select({
        payslip: Payslip,
        item: PayslipItem,
      })
      .from(Payslip)
      .leftJoin(PayslipItem, eq(Payslip.id, PayslipItem.payslipId));

    // Group items by payslip and transform to response DTO
    const payslipMap = new Map<
      number,
      {
        payslip: typeof Payslip.$inferSelect;
        items: (typeof PayslipItem.$inferSelect)[];
      }
    >();

    // Aggregate payslips and their items
    for (const { payslip, item } of payslipsWithItems) {
      if (!payslipMap.has(payslip.id)) {
        payslipMap.set(payslip.id, {
          payslip,
          items: [],
        });
      }
      if (item) {
        payslipMap.get(payslip.id)!.items.push(item);
      }
    }

    // Transform to response DTOs
    const result: PayslipResponseDto[] = Array.from(payslipMap.values()).map(
      ({ payslip, items }) => {
        // Separate additions and deductions
        const additions = items
          .filter((item) => item.direction === "ADDITION")
          .map((item) => new PayslipItemResponseDto(item));

        const deductions = items
          .filter((item) => item.direction === "DEDUCTION")
          .map((item) => new PayslipItemResponseDto(item));

        return new PayslipResponseDto(payslip, additions, deductions);
      }
    );

    return result;
  }

  public async getPayslipById(payslipId: number) {
    // Fetch payslip with its related items
    const payslipsWithItems = await this.db
      .select({
        payslip: Payslip,
        item: PayslipItem,
      })
      .from(Payslip)
      .leftJoin(PayslipItem, eq(Payslip.id, PayslipItem.payslipId))
      .where(eq(Payslip.id, payslipId));

    // If no payslip found, return null
    if (payslipsWithItems.length === 0) {
      return null;
    }

    // Group items for the payslip
    const payslip = payslipsWithItems[0].payslip;
    const items = payslipsWithItems
      .filter((row) => row.item !== null)
      .map((row) => row.item!);

    // Separate additions and deductions
    const additions = items
      .filter((item) => item.direction === "ADDITION")
      .map((item) => new PayslipItemResponseDto(item));

    const deductions = items
      .filter((item) => item.direction === "DEDUCTION")
      .map((item) => new PayslipItemResponseDto(item));

    return { payslip, additions, deductions };
  }

  public async deletePayslipById(payslipId: number): Promise<void> {
    const result = await this.db
      .delete(Payslip)
      .where(eq(Payslip.id, payslipId))
      .returning();

    if (result.length == 0) {
      throw new NotFoundException(
        `Payslip ID with ${payslipId} does not exists`
      );
    }
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
