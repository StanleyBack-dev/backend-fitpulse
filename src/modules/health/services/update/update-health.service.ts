import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HealthEntity } from '../../entities/health.entity';
import { UpdateHealthInputDto } from '../../dtos/update/update-health-input.dto';
import { UpdateHealthResponseDto } from '../../dtos/update/update-health-response.dto';
import { UpdateHealthValidator } from '../../validators/update/update-health.validator';
import { CacheDelProvider } from '../../../../common/cache/providers/cache-del.provider';

@Injectable()
export class UpdateHealthService {
  constructor(
    @InjectRepository(HealthEntity)
    private readonly healthRepository: Repository<HealthEntity>,
    private readonly cacheDel: CacheDelProvider,
  ) { }

  async execute(userId: string, input: UpdateHealthInputDto): Promise<UpdateHealthResponseDto> {
    const updated = await UpdateHealthValidator.validateAndUpdate(userId, input, this.healthRepository);

    await this.cacheDel.execute(`health:list:user:${userId}`);

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