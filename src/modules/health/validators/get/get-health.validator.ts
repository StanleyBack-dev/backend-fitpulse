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

    // 1. Busca por ID específico
    if (input.idHealth) {
      const record = await repo.findOne({ where: { idHealth: input.idHealth, idUsers: userId } });
      if (!record) throw new NotFoundException('Registro de saúde não encontrado.');
      return [record];
    }

    // 2. Busca por Intervalo de Datas
    if (input.startDate && input.endDate) {
      const records = await repo.find({
        where: {
          idUsers: userId,
          // CORREÇÃO AQUI: Passamos as strings direto, sem new Date()
          // O banco de dados sabe comparar strings "2026-01-01" vs "2026-01-31"
          measurementDate: Between(input.startDate, input.endDate),
        },
        order: { measurementDate: 'DESC' },
      });

      if (!records.length) {
        throw new NotFoundException('Nenhum registro de saúde encontrado nesse intervalo.');
      }

      return records;
    }

    // 3. Busca Todos
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
      // Aqui usamos new Date() APENAS para validar a lógica (se start > end)
      // Isso não afeta o banco de dados, então está tudo bem.
      const start = new Date(input.startDate);
      const end = new Date(input.endDate);

      if (start > end) {
        throw new BadRequestException('A data inicial não pode ser posterior à data final.');
      }
    }
  }
}