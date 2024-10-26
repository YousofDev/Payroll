import { AdditionResponseDto } from "@app/dto/AdditionResponseDto";
import { NewAdditionModel } from "@app/model/Addition";
import { AdditionTypeRepository } from "@app/repository/AdditionTypeRepository";
import { EmployeeRepository } from "@app/repository/EmployeeRepository";
import { AdditionRepository } from "@app/repository/AdditionRepository";
import { NotFoundException } from "@exception/NotFoundException";
import { logger } from "@util/logger";

export class AdditionService {
  public constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly additionTypeRepository: AdditionTypeRepository,
    private readonly additionRepository: AdditionRepository
  ) {
    logger.info("AdditionService initialized");
  }

  public async createAddition(additionDto: NewAdditionModel) {
    await this.employeeRepository.getEmployeeOrThrowException(
      additionDto.employeeId
    );
    await this.additionTypeRepository.getAdditionTypeOrThrowException(
      additionDto.additionTypeId
    );

    const addition = await this.additionRepository.createAddition(additionDto);
    return new AdditionResponseDto(addition);
  }

  public async getAllAdditions() {
    const additions = await this.additionRepository.getAllAdditions();
    return additions.map((add) => new AdditionResponseDto(add));
  }

  public async getAdditionById(additionId: number) {
    const addition =
      await this.additionRepository.getAdditionOrThrowException(additionId);
    return new AdditionResponseDto(addition);
  }

  public async updateAddition(
    additionDto: NewAdditionModel,
    additionId: number
  ) {
    await this.additionRepository.getAdditionOrThrowException(additionId);
    await this.employeeRepository.getEmployeeOrThrowException(
      additionDto.employeeId
    );
    await this.additionTypeRepository.getAdditionTypeOrThrowException(
      additionDto.additionTypeId
    );

    const addition = await this.additionRepository.updateAddition(
      additionDto,
      additionId
    );
    return new AdditionResponseDto(addition);
  }

  public async deleteAdditionById(additionId: number): Promise<void> {
    await this.additionRepository.getAdditionOrThrowException(additionId);
    this.additionRepository.deleteAdditionById(additionId);
  }
}
