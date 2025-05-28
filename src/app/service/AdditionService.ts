import { AdditionResponseDto } from "@app/dto/response/AdditionResponseDto";
import { NewAdditionModel } from "@app/model/Addition";
import { AdditionTypeRepository } from "@app/repository/AdditionTypeRepository";
import { EmployeeRepository } from "@app/repository/EmployeeRepository";
import { AdditionRepository } from "@app/repository/AdditionRepository";
import { NotFoundException } from "@exception/NotFoundException";
import { logger } from "@util/logger";
import { FrequencyType, HoursMetadata } from "@data/pgEnums";
import { BadRequestException } from "@exception/BadRequestException";
import { AdditionCreateType } from "@app/dto/request/AdditionCreateRequestDto";
import { AdditionUpdateType } from "@app/dto/request/AdditionUpdateRequestDto";

export class AdditionService {
  public constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly additionTypeRepository: AdditionTypeRepository,
    private readonly additionRepository: AdditionRepository
  ) {}

  public async createAddition(
    additionDto: AdditionCreateType
  ): Promise<AdditionResponseDto> {
    // Ensure the employee exists

    await this.employeeRepository.getEmployeeOrThrowException(
      additionDto.employeeId
    );

    // Ensure the addition type exists
    const additionType =
      await this.additionTypeRepository.getAdditionTypeOrThrowException(
        additionDto.additionTypeId
      );

    // Ensure the addition with type MONTHLY can be added once per employee
    const result = await this.additionRepository.getAdditionByAdditionTypeId(
      additionDto.additionTypeId,
      additionDto.employeeId
    );

    if (result && additionType.frequencyType == FrequencyType.enumValues[0]) {
      throw new BadRequestException(
        "This MONTHLY addition already added to this employee"
      );
    }

    // if hours Addition
    let amount = "0";
    let metadata: HoursMetadata = {};
    if (additionDto.hours) {
      amount = (
        additionDto.hours *
        additionDto.hourRate *
        (additionDto.multipliers || 1)
      ).toString();
      metadata = {
        hours: additionDto.hours,
        hourRate: additionDto.hourRate,
        multiplier: additionDto.multipliers || 1,
      };
    } else if (additionDto.amount) {
      // Just amount
      amount = additionDto.amount;
    }

    const newAddition = {
      employeeId: additionDto.employeeId,
      additionTypeId: additionDto.additionTypeId,
      amount: amount,
      metadata,
    };

    const createdAddition =
      await this.additionRepository.createAddition(newAddition);

    return new AdditionResponseDto(createdAddition, additionType);
  }

  public async getAllAdditions(): Promise<AdditionResponseDto[]> {
    const result = await this.additionRepository.getAllAdditions();
    return result.map(
      ({ addition, additionType }) =>
        new AdditionResponseDto(addition, additionType)
    );
  }

  public async getAdditionById(
    additionId: number
  ): Promise<AdditionResponseDto> {
    const { addition, additionType } =
      await this.additionRepository.getAdditionOrThrowException(additionId);
    return new AdditionResponseDto(addition, additionType);
  }

  public async updateAddition(
    additionDto: AdditionUpdateType,
    additionId: number
  ): Promise<AdditionResponseDto> {
    // Ensure the addition exists
    const { additionType } =
      await this.additionRepository.getAdditionOrThrowException(additionId);

    // if hours Addition
    let amount = "0";
    let metadata: HoursMetadata = {};
    if (additionDto.hours && additionDto.hourRate) {
      amount = (
        additionDto.hours *
        additionDto.hourRate *
        (additionDto.multipliers || 1)
      ).toString();
      metadata = {
        hours: additionDto.hours,
        hourRate: additionDto.hourRate,
        multiplier: additionDto.multipliers || 1,
      };
    } else if (additionDto.amount) {
      // Just amount
      amount = additionDto.amount;
    }

    const updatedAddition = await this.additionRepository.updateAddition(
      {
        amount,
        metadata,
      },
      additionId
    );

    return new AdditionResponseDto(updatedAddition, additionType);
  }

  public async deleteAdditionById(additionId: number) {
    await this.additionRepository.deleteAdditionById(additionId);
  }
}
