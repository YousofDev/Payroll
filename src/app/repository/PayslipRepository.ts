import { eq, and, between, inArray, sql } from "drizzle-orm";
import {
  PayslipItemResponseDto,
  PayslipResponseDto,
} from "@app/dto/PayslipResponseDto";
import { PayslipCreateRequestDtoType } from "@app/dto/PayslipCreateRequestDto";
import { Payslip, PayslipItem, PayslipItemModel } from "@app/model/Payslip";
import { DatabaseClient } from "@data/DatabaseClient";
import { NotFoundException } from "@exception/NotFoundException";
import { logger } from "@util/logger";

import { PreparedPayslipType } from "@app/dto/PreparedPayslipType";
import { Direction } from "@data/pgEnums";
import { DatabaseException } from "@exception/DatabaseException";
import { BadRequestException } from "@exception/BadRequestException";

export class PayslipRepository {
  private readonly db = DatabaseClient.getInstance().getConnection();

  public constructor() {}

  /**
   * Creates a new payslip with its items in a transaction
   */
  public async createPayslip(
    payslip: PreparedPayslipType
  ): Promise<PayslipResponseDto> {
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

        return new PayslipResponseDto(newPayslip, additions, deductions);
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
      name: item.name,
      amount: item.amount,
      employeeId: item.employeeId,
      additionTypeId: item.additionTypeId,
      createdAt: item.createdAt,
      payslipId,
      direction: Direction.enumValues[0],
    }));

    const deductionItems = (payslip.deductions || []).map((item) => ({
      name: item.name,
      amount: item.amount,
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

    return payslips.map((payslip) => new PayslipResponseDto(payslip, [], []));

    // return new PayslipResponseDto(payslips, [], [])

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
