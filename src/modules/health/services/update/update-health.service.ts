import { Injectable } from '@nestjs/common';
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

    const updated = await UpdateHealthValidator.validateAndUpdate(
      userId,
      input,
      this.healthRepository,
    );

    return {
      idHealth: updated.idHealth,
      heightCm: updated.heightCm,
      weightKg: updated.weightKg,
      bmi: updated.bmi,
      bmiStatus: updated.bmiStatus,
      observation: updated.observation,
      measurementDate: updated.measurementDate,
      updatedAt: updated.updatedAt,
    };
  }
}