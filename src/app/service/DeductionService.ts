import { DeductionResponseDto } from "@app/dto/DeductionResponseDto";
import { NewDeductionModel } from "@app/model/Deduction";
import { DeductionTypeRepository } from "@app/repository/DeductionTypeRepository";
import { EmployeeRepository } from "@app/repository/EmployeeRepository";
import { DeductionRepository } from "@app/repository/DeductionRepository";
import { NotFoundException } from "@exception/NotFoundException";
import { logger } from "@util/logger";
import { FrequencyType } from "@data/pgEnums";
import { BadRequestException } from "@exception/BadRequestException";

export class DeductionService {
  public constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly deductionTypeRepository: DeductionTypeRepository,
    private readonly deductionRepository: DeductionRepository
  ) {
    logger.info("DeductionService initialized");
  }

  public async createDeduction(
    deductionDto: NewDeductionModel
  ): Promise<DeductionResponseDto> {
    // Ensure the employee exists
    await this.employeeRepository.getEmployeeOrThrowException(
      deductionDto.employeeId
    );

    // Ensure the deduction type exists
    await this.deductionTypeRepository.getDeductionTypeOrThrowException(
      deductionDto.deductionTypeId
    );

    // Ensure the deduction with type MONTHLY can be added once per employee
    const deductionType =
      await this.deductionRepository.getDeductionByDeductionTypeId(
        deductionDto.deductionTypeId,
        deductionDto.employeeId
      );

    if (deductionType.frequencyType == FrequencyType.enumValues[0]) {
      throw new BadRequestException(
        "This MONTHLY addition already added to this employee"
      );
    }

    const newDeduction =
      await this.deductionRepository.createDeduction(deductionDto);

    return new DeductionResponseDto({
      ...newDeduction,
      name: deductionType.name,
      description: deductionType.description,
    });
  }

  public async getAllDeductions(): Promise<DeductionResponseDto[]> {
    const deductions = await this.deductionRepository.getAllDeductions();
    return deductions.map((add) => new DeductionResponseDto(add));
  }

  public async getDeductionById(
    deductionId: number
  ): Promise<DeductionResponseDto> {
    const deduction =
      await this.deductionRepository.getDeductionOrThrowException(deductionId);
    return new DeductionResponseDto(deduction);
  }

  public async updateDeduction(
    deductionDto: NewDeductionModel,
    deductionId: number
  ): Promise<DeductionResponseDto> {
    // Ensure deduction exists
    await this.deductionRepository.getDeductionOrThrowException(deductionId);

    // Ensure the employee exists
    await this.employeeRepository.getEmployeeOrThrowException(
      deductionDto.employeeId
    );

    // Ensure the deduction type exists
    await this.deductionTypeRepository.getDeductionTypeOrThrowException(
      deductionDto.deductionTypeId
    );

    // Ensure the deduction with type MONTHLY can be added once per employee
    const deductionType =
      await this.deductionRepository.getDeductionByDeductionTypeId(
        deductionDto.deductionTypeId,
        deductionDto.employeeId
      );

    if (deductionType.frequencyType == FrequencyType.enumValues[0]) {
      throw new BadRequestException(
        "This MONTHLY addition already added to this employee"
      );
    }

    const deduction = await this.deductionRepository.updateDeduction(
      deductionDto,
      deductionId
    );

    return new DeductionResponseDto({
      ...deduction,
      name: deductionType.name,
      description: deductionType.description,
    });
  }

  public async deleteDeductionById(deductionId: number) {
    await this.deductionRepository.getDeductionOrThrowException(deductionId);
    this.deductionRepository.deleteDeductionById(deductionId);
  }
}
