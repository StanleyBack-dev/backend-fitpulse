import { BadRequestException } from '@nestjs/common';
import { CreateProfileInputDto } from '../../dtos/create/create-profile-input.dto';

export class CreateProfileValidator {

  // VALIDA SE O INPUT TEM O MÍNIMO NECESSÁRIO PRA CRIAR UM PERFIL
  static ensureValidInput(input: CreateProfileInputDto): void {

    if (!input.idUsers) {
      throw new BadRequestException(
        'O ID do usuário é obrigatório para criar um perfil.'
      );
    }

    const hasAnyProfileField =
      input.phone ||
      input.heightCm ||
      input.weightKg ||
      input.birthDate ||
      input.sex ||
      input.activityLevel ||
      input.goal;

    if (!hasAnyProfileField) {
      throw new BadRequestException(
        'Informe ao menos um dado de perfil (ex: altura, peso, sexo ou data de nascimento).'
      );
    }

    // REGRA DE NEGÓCIO: ALTURA SEM PESO NÃO SERVE PRA IMC
    if (input.weightKg && !input.heightCm) {
      throw new BadRequestException(
        'Para informar o peso, a altura também deve ser informada.'
      );
    }

    // REGRA DE NEGÓCIO: PESO SEM ALTURA NÃO SERVE PRA IMC
    if (input.heightCm && !input.weightKg) {
      throw new BadRequestException(
        'Para informar a altura, o peso também deve ser informado.'
      );
    }
  }
}