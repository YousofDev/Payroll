import { Request, Response } from "express";
import { logger } from "@util/logger";
import { PayslipService } from "@app/service/PayslipService";
import { validate } from "@util/validate";
import { PayslipCreateRequestDto } from "@app/dto/PayslipCreateRequestDto";
import { ResponseEntity } from "@util/ResponseEntity";
import { PayslipIdRequestDto } from "@app/dto/PayslipIdRequestDto";

export class PayslipController {
  public constructor(private readonly payslipService: PayslipService) {}

  public async generatePayslips(req: Request, res: Response) {
    const { body } = await validate(PayslipCreateRequestDto, req);
    const payslip = await this.payslipService.generatePayslips(body);
    ResponseEntity.created(res, payslip);
  }

  public async getAllPayslips(req: Request, res: Response) {
    const payslips = await this.payslipService.getAllPayslips();
    ResponseEntity.ok(res, payslips);
  }

  public async getPayslipById(req: Request, res: Response) {
    const { params } = await validate(PayslipIdRequestDto, req);
    const payslip = await this.payslipService.getPayslipById(params.id);
    ResponseEntity.ok(res, payslip);
  }

  public async deletePayslipById(req: Request, res: Response) {
    const { params } = await validate(PayslipIdRequestDto, req);
    await this.payslipService.deletePayslipById(params.id);
    ResponseEntity.noContent(res);
  }
}
