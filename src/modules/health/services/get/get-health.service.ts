import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
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
    GetHealthValidator.ensureValidDateRange(input ?? {});

    const where: any = { idUsers: userId };

    if (input?.idHealth) {
      const record = await this.healthRepository.findOne({ where: { idHealth: input.idHealth, idUsers: userId } });
      if (!record) throw new NotFoundException('Registro de saúde não encontrado.');

      return [record];
    }

    if (input?.startDate && input?.endDate) {
      where.measurementDate = Between(new Date(input.startDate), new Date(input.endDate));
    }

    const records = await this.healthRepository.find({
      where,
      order: { measurementDate: 'DESC' },
    });

    if (!records.length) throw new NotFoundException('Nenhum registro de saúde encontrado.');

    return records.map((r) => ({
      idHealth: r.idHealth,
      idUsers: r.idUsers,
      heightCm: Number(r.heightCm),
      weightKg: Number(r.weightKg),
      bmi: Number(r.bmi),
      bmiStatus: r.bmiStatus,
      observation: r.observation,
      measurementDate: r.measurementDate,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));
  }
}