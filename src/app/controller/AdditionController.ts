import { Request, Response } from "express";
import { logger } from "@util/logger";
import { validate } from "@util/validate";
import { ResponseEntity } from "@util/ResponseEntity";
import { AdditionService } from "@app/service/AdditionService";
import { AdditionCreateRequestDto } from "@app/dto/AdditionCreateRequestDto";
import { AdditionUpdateRequestDto } from "@app/dto/AdditionUpdateRequestDto";
import { AdditionIdRequestDto } from "@app/dto/AdditionIdRequestDto";

export class AdditionController {
  public constructor(private readonly additionService: AdditionService) {
    logger.info("AdditionController initialized");
  }

  public async getAllAdditions(req: Request, res: Response) {
    const additions = await this.additionService.getAllAdditions();
    ResponseEntity.ok(res, additions);
  }

  public async createAddition(req: Request, res: Response) {
    const { body } = await validate(AdditionCreateRequestDto, req);
    const addition = await this.additionService.createAddition(body);
    ResponseEntity.created(res, addition);
  }

  public async getAdditionById(req: Request, res: Response) {
    const { params } = await validate(AdditionIdRequestDto, req);
    const addition = await this.additionService.getAdditionById(params.id);
    ResponseEntity.ok(res, addition);
  }

  public async updateAddition(req: Request, res: Response) {
    const { body, params } = await validate(AdditionUpdateRequestDto, req);
    const addition = await this.additionService.updateAddition(body, params.id);
    ResponseEntity.ok(res, addition);
  }

  public async deleteAdditionById(req: Request, res: Response) {
    const { params } = await validate(AdditionIdRequestDto, req);
    await this.additionService.deleteAdditionById(params.id);
    ResponseEntity.noContent(res);
  }
}
