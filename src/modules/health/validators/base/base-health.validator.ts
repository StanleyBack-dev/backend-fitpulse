import { BadRequestException } from '@nestjs/common';

export class HealthBaseValidator {
  static validateRanges(heightCm?: number, weightKg?: number): void {
    if (heightCm !== undefined && (heightCm < 50 || heightCm > 250)) {
      throw new BadRequestException('Altura deve estar entre 50cm e 250cm.');
    }

    if (weightKg !== undefined && (weightKg < 20 || weightKg > 300)) {
      throw new BadRequestException('Peso deve estar entre 20kg e 300kg.');
    }
  }

  static validateDate(date?: Date): void {
    if (date && new Date(date) > new Date()) {
      throw new BadRequestException('A data da medição não pode ser no futuro.');
    }
  }
}