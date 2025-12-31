import { BadRequestException } from '@nestjs/common';
import { UpdateProfileInputDto } from '../../dtos/update/update-profile-input.dto';

export class UpdateProfileValidator {

  // GARANTE QUE PELO MENOS UM CAMPO FOI INFORMADO
  static ensureHasFields(input: UpdateProfileInputDto): void {

    const hasAnyField =
      input.phone !== undefined ||
      input.heightCm !== undefined ||
      input.weightKg !== undefined ||
      input.birthDate !== undefined ||
      input.sex !== undefined ||
      input.activityLevel !== undefined ||
      input.goal !== undefined;

    if (!hasAnyField) {
      throw new BadRequestException(
        'Informe ao menos um campo para atualizar o perfil.'
      );
    }

    // REGRA DE NEGÓCIO: NÃO PERMITE PESO SEM ALTURA
    if (input.weightKg !== undefined && input.heightCm === undefined) {
      throw new BadRequestException(
        'Para atualizar o peso, a altura também deve ser informada.'
      );
    }

    // REGRA DE NEGÓCIO: NÃO PERMITE ALTURA SEM PESO
    if (input.heightCm !== undefined && input.weightKg === undefined) {
      throw new BadRequestException(
        'Para atualizar a altura, o peso também deve ser informado.'
      );
    }
  }
}