import { AdditionTypeResponseDto } from "@app/dto/AdditionTypeResponseDto";
import { NewAdditionTypeModel } from "@app/model/AdditionType";
import { AdditionTypeRepository } from "@app/repository/AdditionTypeRepository";
import { NotFoundException } from "@exception/NotFoundException";
import { logger } from "@util/logger";

export class AdditionTypeService {
  public constructor(
    private readonly additionTypeRepository: AdditionTypeRepository
  ) {}

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
    const additionType =
      await this.additionTypeRepository.getAdditionTypeOrThrowException(
        additionTypeId
      );
    return new AdditionTypeResponseDto(additionType);
  }

  public async updateAdditionType(
    additionTypeDto: NewAdditionTypeModel,
    additionTypeId: number
  ) {
    await this.additionTypeRepository.getAdditionTypeOrThrowException(
      additionTypeId
    );
    const additionType = await this.additionTypeRepository.updateAdditionType(
      additionTypeDto,
      additionTypeId
    );
    return new AdditionTypeResponseDto(additionType);
  }

  public async deleteAdditionTypeById(additionTypeId: number): Promise<void> {
    await this.additionTypeRepository.getAdditionTypeOrThrowException(
      additionTypeId
    );
    await this.additionTypeRepository.deleteAdditionTypeById(additionTypeId);
  }
}
