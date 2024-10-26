import { AdditionTypeResponseDto } from "@app/dto/AdditionTypeResponseDto";
import { NewAdditionTypeModel } from "@app/model/AdditionType";
import { AdditionTypeRepository } from "@app/repository/AdditionTypeRepository";
import { NotFoundException } from "@exception/NotFoundException";
import { logger } from "@util/logger";

export class AdditionTypeService {
  public constructor(
    private readonly additionTypeRepository: AdditionTypeRepository
  ) {
    logger.info("AdditionTypeService initialized");
  }

  public async createAdditionType(additionTypeDto: NewAdditionTypeModel) {
    const additionType =
      await this.additionTypeRepository.createAdditionType(additionTypeDto);
    return new AdditionTypeResponseDto(additionType);
  }

  public async getAllAdditionTypes() {
    const additionTypes =
      await this.additionTypeRepository.getAllAdditionTypes();
    return additionTypes.map((add) => new AdditionTypeResponseDto(add));
  }

  public async getAdditionTypeById(additionTypeId: number) {
    const additionType = await this.findAdditionTypeById(additionTypeId);
    return new AdditionTypeResponseDto(additionType);
  }

  public async updateAdditionType(
    additionTypeDto: NewAdditionTypeModel,
    additionTypeId: number
  ) {
    await this.findAdditionTypeById(additionTypeId);
    const additionType = await this.additionTypeRepository.updateAdditionType(
      additionTypeDto,
      additionTypeId
    );
    return new AdditionTypeResponseDto(additionType);
  }

  public async deleteAdditionTypeById(additionTypeId: number): Promise<void> {
    await this.findAdditionTypeById(additionTypeId);
    this.additionTypeRepository.deleteAdditionTypeById(additionTypeId);
  }

  private async findAdditionTypeById(additionTypeId: number) {
    const additionType =
      await this.additionTypeRepository.getAdditionTypeById(additionTypeId);

    if (!additionType) {
      throw new NotFoundException(
        `Addition type ID with ${additionTypeId} does not exists`
      );
    }
    return additionType;
  }
}
