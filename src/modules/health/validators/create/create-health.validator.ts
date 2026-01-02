import { HealthBaseValidator } from '../base/base-health.validator';
import { CreateHealthInputDto } from '../../dtos/create/create-health-input.dto';
import { BadRequestException } from '@nestjs/common';

export class CreateHealthValidator extends HealthBaseValidator {
  static ensureValidData(input: CreateHealthInputDto): void {
    if (!input.heightCm || !input.weightKg) {
      throw new BadRequestException('Altura e peso são obrigatórios.');
    }

    this.validateRanges(input.heightCm, input.weightKg);
    this.validateDate(input.measurementDate);
  }
}