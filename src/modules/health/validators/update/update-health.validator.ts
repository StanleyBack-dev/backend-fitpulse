import { HealthBaseValidator } from '../base/base-health.validator';
import { UpdateHealthInputDto } from '../../dtos/update/update-health-input.dto';
import { BadRequestException } from '@nestjs/common';

export class UpdateHealthValidator extends HealthBaseValidator {
  static ensureValidInput(input: UpdateHealthInputDto): void {
    if (!input.idHealth) throw new BadRequestException('O campo idHealth é obrigatório.');

    const hasChanges = ['heightCm', 'weightKg', 'observation', 'measurementDate'].some(
      (k) => input[k as keyof UpdateHealthInputDto] !== undefined,
    );
    if (!hasChanges) throw new BadRequestException('Nenhum campo informado para atualização.');

    this.validateRanges(input.heightCm, input.weightKg);
    this.validateDate(input.measurementDate);
  }
}