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
      input.currentHeight ||
      input.currentWeight ||
      input.currentImc ||
      input.birthDate ||
      input.sex ||
      input.activityLevel ||
      input.goal;

    if (!hasAnyProfileField) {
      throw new BadRequestException(
        'Informe ao menos um dado de perfil (ex: altura, peso, sexo ou data de nascimento).'
      );
    }

    // REGRA DE NEGÓCIO: PESO SEM ALTURA NÃO SERVE PRA IMC
    if (input.currentWeight && !input.currentHeight) {
      throw new BadRequestException(
        'Para informar o peso, a altura também deve ser informada.'
      );
    }

    // REGRA DE NEGÓCIO: ALTURA SEM PESO NÃO SERVE PRA IMC
    if (input.currentHeight && !input.currentWeight) {
      throw new BadRequestException(
        'Para informar a altura, o peso também deve ser informado.'
      );
    }

    // REGRA DE NEGÓCIO: IMC não deve ser informado manualmente se altura e peso não forem informados
    if (input.currentImc && (!input.currentHeight || !input.currentWeight)) {
      throw new BadRequestException(
        'Para calcular o IMC, é necessário informar altura e peso.'
      );
    }
  }
}