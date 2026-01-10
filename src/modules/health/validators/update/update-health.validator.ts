import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { HealthEntity } from '../../entities/health.entity';
import { UpdateHealthInputDto } from '../../dtos/update/update-health-input.dto';
import { HealthBaseValidator } from '../base/base-health.validator';
import { calculateBMI } from 'src/common/utils/bmi.util';

export class UpdateHealthValidator extends HealthBaseValidator {

  static async validateAndUpdate(
    userId: string,
    input: UpdateHealthInputDto,
    repo: Repository<HealthEntity>,
  ): Promise<HealthEntity> {
    this.ensureValidInput(input);

    const record = await repo.findOne({ where: { idHealth: input.idHealth, idUsers: userId } });
    if (!record) {
      throw new NotFoundException('Registro de saúde não encontrado.');
    }

    if (record.idUsers !== userId) {
      throw new ForbiddenException('Você não tem permissão para editar este registro.');
    }

    Object.assign(record, input);

    if (input.heightCm || input.weightKg) {
      const height = input.heightCm ?? record.heightCm;
      const weight = input.weightKg ?? record.weightKg;

      const { bmi, status } = calculateBMI(height, weight);
      record.bmi = bmi;
      record.bmiStatus = status;
    }

    return repo.save(record);
  }

  private static ensureValidInput(input: UpdateHealthInputDto): void {
    if (!input.idHealth) {
      throw new BadRequestException('O campo idHealth é obrigatório.');
    }

    const hasChanges = ['heightCm', 'weightKg', 'observation', 'measurementDate'].some(
      (k) => input[k as keyof UpdateHealthInputDto] !== undefined,
    );

    if (!hasChanges) {
      throw new BadRequestException('Nenhum campo informado para atualização.');
    }

    this.validateRanges(input.heightCm, input.weightKg);
    this.validateDate(input.measurementDate);
  }
}