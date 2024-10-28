import { Request, Response } from "express";
import { logger } from "@util/logger";
import { validate } from "@util/validate";
import { ResponseEntity } from "@util/ResponseEntity";
import { DeductionService } from "@app/service/DeductionService";
import { DeductionCreateRequestDto } from "@app/dto/DeductionCreateRequestDto";
import { DeductionUpdateRequestDto } from "@app/dto/DeductionUpdateRequestDto";
import { DeductionIdRequestDto } from "@app/dto/DeductionIdRequestDto";

export class DeductionController {
  public constructor(private readonly deductionService: DeductionService) {
    logger.info("DeductionController initialized");
  }

  public async getAllDeductions(req: Request, res: Response) {
    const deductions = await this.deductionService.getAllDeductions();
    ResponseEntity.ok(res, deductions);
  }

  public async createDeduction(req: Request, res: Response) {
    const { body } = await validate(DeductionCreateRequestDto, req);
    const deduction = await this.deductionService.createDeduction(body);
    ResponseEntity.created(res, deduction);
  }

  public async getDeductionById(req: Request, res: Response) {
    const { params } = await validate(DeductionIdRequestDto, req);
    const deduction = await this.deductionService.getDeductionById(params.id);
    ResponseEntity.ok(res, deduction);
  }

  public async updateDeduction(req: Request, res: Response) {
    const { body, params } = await validate(DeductionUpdateRequestDto, req);
    const deduction = await this.deductionService.updateDeduction(
      body,
      params.id
    );
    ResponseEntity.ok(res, deduction);
  }

  public async deleteDeductionById(req: Request, res: Response) {
    const { params } = await validate(DeductionIdRequestDto, req);
    await this.deductionService.deleteDeductionById(params.id);
    ResponseEntity.noContent(res);
  }
}
