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

  static calculateBMI(heightCm: number, weightKg: number): { bmi: number; status: string } {
    const heightM = heightCm / 100;
    const bmi = Number((weightKg / (heightM * heightM)).toFixed(2));

    let status = '';
    if (bmi < 18.5) status = 'Abaixo do peso';
    else if (bmi < 25) status = 'Peso normal';
    else if (bmi < 30) status = 'Sobrepeso';
    else status = 'Obesidade';

    return { bmi, status };
  }
}