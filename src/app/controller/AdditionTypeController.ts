import { Request, Response } from "express";
import { logger } from "@util/logger";
import { validate } from "@util/validate";
import { ResponseEntity } from "@util/ResponseEntity";
import { AdditionTypeService } from "@app/service/AdditionTypeService";
import { AdditionTypeCreateRequestDto } from "@app/dto/AdditionTypeCreateRequestDto";
import { AdditionTypeUpdateRequestDto } from "@app/dto/AdditionTypeUpdateRequestDto";
import { AdditionTypeIdRequestDto } from "@app/dto/AdditionTypeIdRequestDto";

export class AdditionTypeController {
  public constructor(
    private readonly additionTypeService: AdditionTypeService
  ) {}

  public async getAllAdditionTypes(req: Request, res: Response) {
    const additionTypes = await this.additionTypeService.getAllAdditionTypes();
    ResponseEntity.ok(res, additionTypes);
  }

  public async createAdditionType(req: Request, res: Response) {
    const { body } = await validate(AdditionTypeCreateRequestDto, req);
    const additionType =
      await this.additionTypeService.createAdditionType(body);
    ResponseEntity.created(res, additionType);
  }

  public async getAdditionTypeById(req: Request, res: Response) {
    const { params } = await validate(AdditionTypeIdRequestDto, req);
    const additionType = await this.additionTypeService.getAdditionTypeById(
      params.id
    );
    ResponseEntity.ok(res, additionType);
  }

  public async updateAdditionType(req: Request, res: Response) {
    const { body, params } = await validate(AdditionTypeUpdateRequestDto, req);
    const additionType = await this.additionTypeService.updateAdditionType(
      body,
      params.id
    );
    ResponseEntity.ok(res, additionType);
  }

  public async deleteAdditionTypeById(req: Request, res: Response) {
    const { params } = await validate(AdditionTypeIdRequestDto, req);
    await this.additionTypeService.deleteAdditionTypeById(params.id);
    ResponseEntity.noContent(res);
  }
}
