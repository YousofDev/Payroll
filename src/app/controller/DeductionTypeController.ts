import { Request, Response } from "express";
import { logger } from "@util/logger";
import { validate } from "@util/validate";
import { catchAsync } from "@util/catchAsync";
import { ResponseEntity } from "@util/ResponseEntity";
import { DeductionTypeService } from "@app/service/DeductionTypeService";
import { DeductionTypeCreateRequestDto } from "@app/dto/DeductionTypeCreateRequestDto";
import { DeductionTypeUpdateRequestDto } from "@app/dto/DeductionTypeUpdateRequestDto";
import { DeductionTypeIdRequestDto } from "@app/dto/DeductionTypeIdRequestDto";

export class DeductionTypeController {
  public constructor(
    private readonly deductionTypeService: DeductionTypeService
  ) {
    logger.info("DeductionTypeController initialized");
  }

  public getAllDeductionTypes = catchAsync(
    async (req: Request, res: Response) => {
      const deductionTypes =
        await this.deductionTypeService.getAllDeductionTypes();

      ResponseEntity.ok(res, deductionTypes);
    }
  );

  public createDeductionType = catchAsync(
    async (req: Request, res: Response) => {
      const { body } = await validate(DeductionTypeCreateRequestDto, req);

      const deductionType =
        await this.deductionTypeService.createDeductionType(body);

      ResponseEntity.created(res, deductionType);
    }
  );

  public getDeductionTypeById = catchAsync(
    async (req: Request, res: Response) => {
      const { params } = await validate(DeductionTypeIdRequestDto, req);

      const deductionType =
        await this.deductionTypeService.getDeductionTypeById(params.id);

      ResponseEntity.ok(res, deductionType);
    }
  );

  public updateDeductionType = catchAsync(
    async (req: Request, res: Response) => {
      const { body, params } = await validate(
        DeductionTypeUpdateRequestDto,
        req
      );

      const deductionType = await this.deductionTypeService.updateDeductionType(
        body,
        params.id
      );

      ResponseEntity.ok(res, deductionType);
    }
  );

  public deleteDeductionTypeById = catchAsync(
    async (req: Request, res: Response) => {
      const { params } = await validate(DeductionTypeIdRequestDto, req);

      await this.deductionTypeService.deleteDeductionTypeById(params.id);

      ResponseEntity.noContent(res);
    }
  );
}
