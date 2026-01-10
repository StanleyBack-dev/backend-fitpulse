import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository, Between } from 'typeorm';
import { HealthEntity } from '../../entities/health.entity';
import { GetHealthInputDto } from '../../dtos/get/get-health-input.dto';

export class GetHealthValidator {

  static async validateAndFetchRecords(
    userId: string,
    input: GetHealthInputDto,
    repo: Repository<HealthEntity>,
  ): Promise<HealthEntity[]> {
    this.validateDateRange(input);

    if (input.idHealth) {
      const record = await repo.findOne({ where: { idHealth: input.idHealth, idUsers: userId } });
      if (!record) throw new NotFoundException('Registro de saúde não encontrado.');
      return [record];
    }

    if (input.startDate && input.endDate) {
      const records = await repo.find({
        where: {
          idUsers: userId,
          measurementDate: Between(new Date(input.startDate), new Date(input.endDate)),
        },
        order: { measurementDate: 'DESC' },
      });

      if (!records.length) {
        throw new NotFoundException('Nenhum registro de saúde encontrado nesse intervalo.');
      }

      return records;
    }

    const records = await repo.find({
      where: { idUsers: userId },
      order: { measurementDate: 'DESC' },
    });

    if (!records.length) {
      throw new NotFoundException('Nenhum registro de saúde encontrado.');
    }

    return records;
  }

  private static validateDateRange(input: GetHealthInputDto): void {
    if (input.startDate && input.endDate) {
      const start = new Date(input.startDate);
      const end = new Date(input.endDate);

      if (start > end) {
        throw new BadRequestException('A data inicial não pode ser posterior à data final.');
      }
    }
  }
}