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

  // CORREÇÃO AQUI: Aceitar string | Date
  static validateDate(date?: string | Date): void {
    if (!date) return;

    // Converte para objeto Date para fazer a comparação matemática
    const dateObj = new Date(date);
    const now = new Date();

    // Verifica se é uma data válida
    if (isNaN(dateObj.getTime())) {
      throw new BadRequestException('Data inválida.');
    }

    // Compara se é futuro
    // Nota: new Date("2026-01-10") cria 00:00 UTC. 
    // Se for "hoje", geralmente 00:00 é menor que "agora", então passa.
    if (dateObj > now) {
      throw new BadRequestException('A data da medição não pode ser no futuro.');
    }
  }
}