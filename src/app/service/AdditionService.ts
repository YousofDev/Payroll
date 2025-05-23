import { AdditionResponseDto } from "@app/dto/AdditionResponseDto";
import { NewAdditionModel } from "@app/model/Addition";
import { AdditionTypeRepository } from "@app/repository/AdditionTypeRepository";
import { EmployeeRepository } from "@app/repository/EmployeeRepository";
import { AdditionRepository } from "@app/repository/AdditionRepository";
import { NotFoundException } from "@exception/NotFoundException";
import { logger } from "@util/logger";
import { FrequencyType } from "@data/pgEnums";
import { BadRequestException } from "@exception/BadRequestException";

export class AdditionService {
  public constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly additionTypeRepository: AdditionTypeRepository,
    private readonly additionRepository: AdditionRepository
  ) {}

  public async createAddition(
    additionDto: NewAdditionModel
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
    const additionTypeExists =
      await this.additionRepository.getAdditionByAdditionTypeId(
        additionDto.additionTypeId,
        additionDto.employeeId
      );

    if (
      additionTypeExists &&
      additionTypeExists.frequencyType == FrequencyType.enumValues[0]
    ) {
      throw new BadRequestException(
        "This MONTHLY addition already added to this employee"
      );
    }

    const newAddition =
      await this.additionRepository.createAddition(additionDto);

    return new AdditionResponseDto({
      ...newAddition,
      name: additionType && additionType.name,
      description: additionType && additionType.description,
    });
  }

  public async getAllAdditions(): Promise<AdditionResponseDto[]> {
    const additions = await this.additionRepository.getAllAdditions();
    return additions.map((add) => new AdditionResponseDto(add));
  }

  public async getAdditionById(
    additionId: number
  ): Promise<AdditionResponseDto> {
    const addition =
      await this.additionRepository.getAdditionOrThrowException(additionId);
    return new AdditionResponseDto(addition);
  }

  public async updateAddition(
    additionDto: NewAdditionModel,
    additionId: number
  ): Promise<AdditionResponseDto> {
    // Ensure the addition exists
    await this.additionRepository.getAdditionOrThrowException(additionId);

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
    const additionTypeExists =
      await this.additionRepository.getAdditionByAdditionTypeId(
        additionDto.additionTypeId,
        additionDto.employeeId
      );

    if (
      additionTypeExists &&
      additionType.frequencyType == FrequencyType.enumValues[0]
    ) {
      throw new BadRequestException(
        "This MONTHLY addition already added to this employee"
      );
    }

    await this.additionTypeRepository.getAdditionTypeOrThrowException(
      additionDto.additionTypeId
    );

    const updatedAddition = await this.additionRepository.updateAddition(
      additionDto,
      additionId
    );

    return new AdditionResponseDto({
      ...updatedAddition,
      name: additionType && additionType.name,
      description: additionType && additionType.description,
    });
  }

  public async deleteAdditionById(additionId: number) {
    await this.additionRepository.getAdditionOrThrowException(additionId);
    await this.additionRepository.deleteAdditionById(additionId);
  }
}
