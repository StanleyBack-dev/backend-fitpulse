import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HealthEntity } from '../../entities/health.entity';
import { CreateHealthInputDto } from '../../dtos/create/create-health-input.dto';
import { CreateHealthResponseDto } from '../../dtos/create/create-health-response.dto';
import { CreateHealthValidator } from '../../validators/create/create-health.validator';

@Injectable()
export class CreateHealthService {
  constructor(
    @InjectRepository(HealthEntity)
    private readonly healthRepository: Repository<HealthEntity>,
  ) {}

  async execute(userId: string, input: CreateHealthInputDto): Promise<CreateHealthResponseDto> {

    const saved = await CreateHealthValidator.validateAndCreate(
      userId,
      input,
      this.healthRepository,
    );

    return {
      idHealth: saved.idHealth,
      heightCm: saved.heightCm,
      weightKg: saved.weightKg,
      bmi: saved.bmi,
      bmiStatus: saved.bmiStatus,
      observation: saved.observation,
      measurementDate: saved.measurementDate,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
    };
  }
}