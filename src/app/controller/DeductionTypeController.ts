import { Request, Response } from "express";
import { logger } from "@util/logger";
import { validate } from "@util/validate";
import { ResponseEntity } from "@util/ResponseEntity";
import { DeductionTypeService } from "@app/service/DeductionTypeService";
import { DeductionTypeCreateRequestDto } from "@app/dto/request/DeductionTypeCreateRequestDto";
import { DeductionTypeUpdateRequestDto } from "@app/dto/request/DeductionTypeUpdateRequestDto";
import { IdParamRequestDto } from "@app/dto/request/IdParamRequestDto";

export class DeductionTypeController {
  public constructor(
    private readonly deductionTypeService: DeductionTypeService
  ) {}

  public async getAllDeductionTypes(req: Request, res: Response) {
    const deductionTypes =
      await this.deductionTypeService.getAllDeductionTypes();
    ResponseEntity.ok(res, deductionTypes);
  }

  public async createDeductionType(req: Request, res: Response) {
    const { body } = await validate(DeductionTypeCreateRequestDto, req);
    const deductionType =
      await this.deductionTypeService.createDeductionType(body);
    ResponseEntity.created(res, deductionType);
  }

  public async getDeductionTypeById(req: Request, res: Response) {
    const { params } = await validate(IdParamRequestDto, req);
    const deductionType = await this.deductionTypeService.getDeductionTypeById(
      params.id
    );
    ResponseEntity.ok(res, deductionType);
  }

  public async updateDeductionType(req: Request, res: Response) {
    const { body, params } = await validate(DeductionTypeUpdateRequestDto, req);
    const deductionType = await this.deductionTypeService.updateDeductionType(
      body,
      params.id
    );
    ResponseEntity.ok(res, deductionType);
  }

  public async deleteDeductionTypeById(req: Request, res: Response) {
    const { params } = await validate(IdParamRequestDto, req);
    await this.deductionTypeService.deleteDeductionTypeById(params.id);
    ResponseEntity.noContent(res);
  }
}
