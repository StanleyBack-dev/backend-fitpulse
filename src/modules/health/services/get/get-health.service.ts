import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { HealthEntity } from "../../entities/health.entity";
import { GetHealthInputDto } from "../../dtos/get/get-health-input.dto";
import { GetHealthResponseDto } from "../../dtos/get/get-health-response.dto";
import { GetHealthValidator } from "../../validators/get/get-health.validator";
import { CacheGetProvider } from "../../../../common/cache/providers/cache-get.provider";
import { CacheSetProvider } from "../../../../common/cache/providers/cache-set.provider";

@Injectable()
export class GetHealthService {
  constructor(
    @InjectRepository(HealthEntity)
    private readonly healthRepository: Repository<HealthEntity>,
    private readonly cacheGet: CacheGetProvider,
    private readonly cacheSet: CacheSetProvider,
  ) { }

  async findAll(
    userId: string,
    input?: GetHealthInputDto,
  ): Promise<GetHealthResponseDto[]> {
    const cacheKey = `health:list:user:${userId}`;

    const cached = await this.cacheGet.execute<GetHealthResponseDto[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const records = await GetHealthValidator.validateAndFetchRecords(
      userId,
      input ?? {},
      this.healthRepository,
    );

    const formatted = records.map((r) => ({
      idHealth: r.idHealth,
      heightCm: r.heightCm,
      weightKg: r.weightKg,
      bmi: r.bmi,
      bmiStatus: r.bmiStatus,
      observation: r.observation,
      measurementDate: new Date(r.measurementDate).toISOString().slice(0, 10),
      createdAt: new Date(r.createdAt).toISOString(),
      updatedAt: new Date(r.updatedAt).toISOString(),
    }));

    await this.cacheSet.execute(cacheKey, formatted, 60 * 5);

    return formatted;
  }
}