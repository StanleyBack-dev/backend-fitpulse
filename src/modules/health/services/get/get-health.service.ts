import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HealthEntity } from '../../entities/health.entity';
import { GetHealthInputDto } from '../../dtos/get/get-health-input.dto';
import { GetHealthResponseDto } from '../../dtos/get/get-health-response.dto';
import { GetHealthValidator } from '../../validators/get/get-health.validator';

@Injectable()
export class GetHealthService {
  constructor(
    @InjectRepository(HealthEntity)
    private readonly healthRepository: Repository<HealthEntity>,
  ) {}

  async findAll(userId: string, input?: GetHealthInputDto): Promise<GetHealthResponseDto[]> {

    const records = await GetHealthValidator.validateAndFetchRecords(
      userId,
      input ?? {},
      this.healthRepository,
    );

    return records.map((r) => ({
      idHealth: r.idHealth,
      heightCm: r.heightCm,
      weightKg: r.weightKg,
      bmi: r.bmi,
      bmiStatus: r.bmiStatus,
      observation: r.observation,
      measurementDate: r.measurementDate,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));
  }
}