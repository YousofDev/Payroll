import { Request, Response } from "express";
import { logger } from "@util/logger";
import { PayslipService } from "@app/service/PayslipService";
import { catchAsync } from "@util/catchAsync";
import { validate } from "@util/validate";
import { PayslipCreateRequestDto } from "@app/dto/PayslipCreateRequestDto";
import { ResponseEntity } from "@util/ResponseEntity";
import { PayslipIdRequestDto } from "@app/dto/PayslipIdRequestDto";

export class PayslipController {
  public constructor(private readonly payslipService: PayslipService) {
    logger.info("PayslipController initialized");
  }

  public generatePayslip = catchAsync(async (req: Request, res: Response) => {
    const { body } = await validate(PayslipCreateRequestDto, req);
    const payslip = await this.payslipService.generatePayslip(body);
    ResponseEntity.created(res, payslip);
  });

  public getPayslipById = catchAsync(async(req: Request, res: Response)=>{
    const {params} = await validate(PayslipIdRequestDto, req)
    const payslip = await this.payslipService.getPayslipById(params.id);
    ResponseEntity.ok(res, payslip);
  })

  
}
