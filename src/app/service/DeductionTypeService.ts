import { DeductionTypeResponseDto } from "@app/dto/DeductionTypeResponseDto";
import { NewDeductionTypeModel } from "@app/model/DeductionType";
import { DeductionTypeRepository } from "@app/repository/DeductionTypeRepository";
import { NotFoundException } from "@exception/NotFoundException";
import { logger } from "@util/logger";

export class DeductionTypeService {
  public constructor(
    private readonly deductionTypeRepository: DeductionTypeRepository
  ) {}

  public async createDeductionType(deductionTypeDto: NewDeductionTypeModel) {
    const deductionType =
      await this.deductionTypeRepository.createDeductionType(deductionTypeDto);
    return new DeductionTypeResponseDto(deductionType);
  }

  public async getAllDeductionTypes() {
    const deductionTypes =
      await this.deductionTypeRepository.getAllDeductionTypes();
    return deductionTypes.map((d) => new DeductionTypeResponseDto(d));
  }

  public async getDeductionTypeById(deductionTypeId: number) {
    const deductionType =
      await this.deductionTypeRepository.getDeductionTypeOrThrowException(
        deductionTypeId
      );
    return new DeductionTypeResponseDto(deductionType);
  }

  public async updateDeductionType(
    deductionTypeDto: NewDeductionTypeModel,
    deductionTypeId: number
  ) {
    await this.deductionTypeRepository.getDeductionTypeOrThrowException(
      deductionTypeId
    );
    const deductionType =
      await this.deductionTypeRepository.updateDeductionType(
        deductionTypeDto,
        deductionTypeId
      );
    return new DeductionTypeResponseDto(deductionType);
  }

  public async deleteDeductionTypeById(deductionTypeId: number): Promise<void> {
    await this.deductionTypeRepository.getDeductionTypeOrThrowException(
      deductionTypeId
    );
    this.deductionTypeRepository.deleteDeductionTypeById(deductionTypeId);
  }
}
