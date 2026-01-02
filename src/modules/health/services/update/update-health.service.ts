import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HealthEntity } from '../../entities/health.entity';
import { UpdateHealthInputDto } from '../../dtos/update/update-health-input.dto';
import { UpdateHealthResponseDto } from '../../dtos/update/update-health-response.dto';
import { UpdateHealthValidator } from '../../validators/update/update-health.validator';

@Injectable()
export class UpdateHealthService {
  constructor(
    @InjectRepository(HealthEntity)
    private readonly healthRepository: Repository<HealthEntity>,
  ) {}

  async execute(userId: string, input: UpdateHealthInputDto): Promise<UpdateHealthResponseDto> {
    UpdateHealthValidator.ensureValidInput(input);

    const health = await this.healthRepository.findOne({
      where: { idHealth: input.idHealth, idUsers: userId },
    });

    if (!health) {
      throw new NotFoundException('Registro de saúde não encontrado.');
    }

    if (health.idUsers !== userId) {
      throw new ForbiddenException('Você não tem permissão para editar este registro.');
    }

    Object.assign(health, input);

    if (input.heightCm || input.weightKg) {
      const height = input.heightCm ?? Number(health.heightCm);
      const weight = input.weightKg ?? Number(health.weightKg);
      const { bmi, status } = UpdateHealthValidator.calculateBMI(height, weight);

      health.bmi = bmi;
      health.bmiStatus = status;
    }

    const updated = await this.healthRepository.save(health);

    return {
      idHealth: updated.idHealth,
      idUsers: updated.idUsers,
      heightCm: Number(updated.heightCm),
      weightKg: Number(updated.weightKg),
      bmi: Number(updated.bmi),
      bmiStatus: updated.bmiStatus,
      observation: updated.observation,
      measurementDate: updated.measurementDate,
      updatedAt: updated.updatedAt,
    };
  }
}