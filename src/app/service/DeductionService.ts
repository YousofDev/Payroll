import { DeductionResponseDto } from "@app/dto/DeductionResponseDto";
import { NewDeductionModel } from "@app/model/Deduction";
import { DeductionTypeRepository } from "@app/repository/DeductionTypeRepository";
import { EmployeeRepository } from "@app/repository/EmployeeRepository";
import { DeductionRepository } from "@app/repository/DeductionRepository";
import { NotFoundException } from "@exception/NotFoundException";
import { logger } from "@util/logger";

export class DeductionService {
  public constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly deductionTypeRepository: DeductionTypeRepository,
    private readonly deductionRepository: DeductionRepository
  ) {
    logger.info("DeductionService initialized");
  }

  public async createDeduction(deductionDto: NewDeductionModel) {
    await this.employeeRepository.getEmployeeOrThrowException(
      deductionDto.employeeId
    );
    await this.deductionTypeRepository.getDeductionTypeOrThrowException(
      deductionDto.deductionTypeId
    );

    const deduction = await this.deductionRepository.createDeduction(deductionDto);
    return new DeductionResponseDto(deduction);
  }

  public async getAllDeductions() {
    const deductions = await this.deductionRepository.getAllDeductions();
    return deductions.map((add) => new DeductionResponseDto(add));
  }

  public async getDeductionById(deductionId: number) {
    const deduction =
      await this.deductionRepository.getDeductionOrThrowException(deductionId);
    return new DeductionResponseDto(deduction);
  }

  public async updateDeduction(
    deductionDto: NewDeductionModel,
    deductionId: number
  ) {
    await this.deductionRepository.getDeductionOrThrowException(deductionId);
    await this.employeeRepository.getEmployeeOrThrowException(
      deductionDto.employeeId
    );
    await this.deductionTypeRepository.getDeductionTypeOrThrowException(
      deductionDto.deductionTypeId
    );

    const deduction = await this.deductionRepository.updateDeduction(
      deductionDto,
      deductionId
    );
    return new DeductionResponseDto(deduction);
  }

  public async deleteDeductionById(deductionId: number) {
    await this.deductionRepository.getDeductionOrThrowException(deductionId);
    this.deductionRepository.deleteDeductionById(deductionId);
  }
}
