import { HealthBaseValidator } from "../base/base-health.validator";
import { CreateHealthInputDto } from "../../dtos/create/create-health-input.dto";
import { BadRequestException } from "@nestjs/common";
import { Repository, Between } from "typeorm";
import { HealthEntity } from "../../entities/health.entity";
import { calculateBMI } from "../../../../common/utils/bmi.util";

export class CreateHealthValidator extends HealthBaseValidator {
  static async validateAndCreate(
    userId: string,
    input: CreateHealthInputDto,
    repo: Repository<HealthEntity>
  ): Promise<HealthEntity> {
    const date = new Date(input.measurementDate);
    const fixedDate = new Date(
      date.getTime() + date.getTimezoneOffset() * 60000
    );
    input.measurementDate = fixedDate;

    this.ensureRequiredFields(input);
    this.validateRanges(input.heightCm, input.weightKg);
    this.validateDate(input.measurementDate);

    await this.ensureUniqueMeasurementDate(userId, input.measurementDate, repo);

    const { bmi, status } = calculateBMI(input.heightCm, input.weightKg);

    const newRecord = repo.create({
      ...input,
      idUsers: userId,
      bmi,
      bmiStatus: status,
    });

    return repo.save(newRecord);
  }

  private static ensureRequiredFields(input: CreateHealthInputDto): void {
    if (!input.heightCm || !input.weightKg) {
      throw new BadRequestException("Altura e peso são obrigatórios.");
    }

    if (!input.measurementDate) {
      throw new BadRequestException("A data da medição é obrigatória.");
    }
  }

  private static async ensureUniqueMeasurementDate(
    userId: string,
    date: Date,
    repo: Repository<HealthEntity>
  ): Promise<void> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const existing = await repo.findOne({
      where: {
        idUsers: userId,
        measurementDate: Between(startOfDay, endOfDay),
      },
    });

    if (existing) {
      throw new BadRequestException(
        "Já existe um registro de saúde para esta data."
      );
    }
  }
}