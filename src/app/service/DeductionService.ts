import { DeductionResponseDto } from "@app/dto/response/DeductionResponseDto";
import { DeductionTypeRepository } from "@app/repository/DeductionTypeRepository";
import { EmployeeRepository } from "@app/repository/EmployeeRepository";
import { DeductionRepository } from "@app/repository/DeductionRepository";
import { NotFoundException } from "@exception/NotFoundException";
import { logger } from "@util/logger";
import { FrequencyType, HoursMetadata } from "@data/pgEnums";
import { BadRequestException } from "@exception/BadRequestException";
import { DeductionCreateType } from "@app/dto/request/DeductionCreateRequestDto";
import { DeductionUpdateType } from "@app/dto/request/DeductionUpdateRequestDto";

export class DeductionService {
  public constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly deductionTypeRepository: DeductionTypeRepository,
    private readonly deductionRepository: DeductionRepository
  ) {}

  public async createDeduction(
    deductionDto: DeductionCreateType
  ): Promise<DeductionResponseDto> {
    // Ensure the employee exists
    await this.employeeRepository.getEmployeeOrThrowException(
      deductionDto.employeeId
    );

    // Ensure the deduction type exists
    const deductionType =
      await this.deductionTypeRepository.getDeductionTypeOrThrowException(
        deductionDto.deductionTypeId
      );

    // Ensure the deduction with type MONTHLY can be added once per employee
    const result = await this.deductionRepository.getDeductionByDeductionTypeId(
      deductionDto.deductionTypeId,
      deductionDto.employeeId
    );

    if (result && deductionType.frequencyType == FrequencyType.enumValues[0]) {
      throw new BadRequestException(
        "This MONTHLY deduction already added to this employee"
      );
    }

    // if hours deduction
    let amount = "0";
    let metadata: HoursMetadata = {};
    if (deductionDto.hours) {
      amount = (
        deductionDto.hours *
        deductionDto.hourRate *
        (deductionDto.multipliers || 1)
      ).toString();
      metadata = {
        hours: deductionDto.hours,
        hourRate: deductionDto.hourRate,
        multiplier: deductionDto.multipliers || 1,
      };
    } else if (deductionDto.amount) {
      // Just amount
      amount = deductionDto.amount;
    }

    const newDeduction = {
      employeeId: deductionDto.employeeId,
      deductionTypeId: deductionDto.deductionTypeId,
      amount: amount,
      metadata,
    };

    const createdDeduction =
      await this.deductionRepository.createDeduction(newDeduction);

    logger.warn("DeductionId: " + createdDeduction.id);

    return new DeductionResponseDto(createdDeduction, deductionType);
  }

  public async getAllDeductions(): Promise<DeductionResponseDto[]> {
    const result = await this.deductionRepository.getAllDeductions();
    return result.map(
      ({ deduction, deductionType }) =>
        new DeductionResponseDto(deduction, deductionType)
    );
  }

  public async getDeductionById(
    deductionId: number
  ): Promise<DeductionResponseDto> {
    const { deduction, deductionType } =
      await this.deductionRepository.getDeductionOrThrowException(deductionId);
    return new DeductionResponseDto(deduction, deductionType);
  }

  public async updateDeduction(
    deductionDto: DeductionUpdateType,
    deductionId: number
  ): Promise<DeductionResponseDto> {
    // Ensure deduction exists
    const { deductionType } =
      await this.deductionRepository.getDeductionOrThrowException(deductionId);

    // if hours deduction
    let amount = "0";
    let metadata: HoursMetadata = {};
    if (deductionDto.hours && deductionDto.hourRate) {
      amount = (
        deductionDto.hours *
        deductionDto.hourRate *
        (deductionDto.multipliers || 1)
      ).toString();
      metadata = {
        hours: deductionDto.hours,
        hourRate: deductionDto.hourRate,
        multiplier: deductionDto.multipliers || 1,
      };
    } else if (deductionDto.amount) {
      // Just amount
      amount = deductionDto.amount;
    }

    const newDeduction = {
      amount: amount,
      metadata,
    };

    const updatedDeduction = await this.deductionRepository.updateDeduction(
      newDeduction,
      deductionId
    );

    return new DeductionResponseDto(updatedDeduction, deductionType);
  }

  public async deleteDeductionById(deductionId: number) {
    await this.deductionRepository.getDeductionOrThrowException(deductionId);
    this.deductionRepository.deleteDeductionById(deductionId);
  }
}
