import { HealthBaseValidator } from "../base/base-health.validator";
import { CreateHealthInputDto } from "../../dtos/create/create-health-input.dto";
import { BadRequestException } from "@nestjs/common";
import { Repository } from "typeorm"; // Removemos 'Between' pois não é mais necessário
import { HealthEntity } from "../../entities/health.entity";
import { calculateBMI } from "../../../../common/utils/bmi.util";

export class CreateHealthValidator extends HealthBaseValidator {

  static async validateAndCreate(
    userId: string,
    input: CreateHealthInputDto,
    repo: Repository<HealthEntity>
  ): Promise<HealthEntity> {
    
    // 1. Validações Básicas
    this.ensureRequiredFields(input);
    
    // 2. Valida se a string de data é válida
    // Nota: Certifique-se que seu BaseValidator aceita string ou faça new Date(input.measurementDate) apenas para validar
    this.validateDate(input.measurementDate); 
    
    this.validateRanges(input.heightCm, input.weightKg);

    // 3. Verifica duplicidade usando a string direta
    await this.ensureUniqueMeasurementDate(userId, input.measurementDate, repo);

    // 4. Cálculos
    const { bmi, status } = calculateBMI(input.heightCm, input.weightKg);

    // 5. Criação da Entidade
    // Passamos a string measurementDate diretamente. O TypeORM lida com isso se a coluna for type: 'date'
    const newRecord = repo.create({
      idUsers: userId,
      heightCm: input.heightCm,
      weightKg: input.weightKg,
      bmi: bmi,
      bmiStatus: status,
      observation: input.observation,
      measurementDate: input.measurementDate, 
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
    dateString: string, // Mudamos de Date para string
    repo: Repository<HealthEntity>
  ): Promise<void> {
    
    // Busca exata pela string (Ex: "2026-01-10")
    // Isso é mais rápido e seguro que usar Between para datas sem hora
    const existing = await repo.findOne({
      where: {
        idUsers: userId,
        measurementDate: dateString, 
      },
    });

    if (existing) {
      throw new BadRequestException(
        "Já existe um registro de saúde para esta data."
      );
    }
  }
}