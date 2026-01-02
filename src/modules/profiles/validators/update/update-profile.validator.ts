import { BadRequestException } from '@nestjs/common';
import { UpdateProfileInputDto } from '../../dtos/update/update-profile-input.dto';

export class UpdateProfileValidator {
  static ensureHasFields(input: UpdateProfileInputDto): void {
    const hasAnyField =
      input.phone !== undefined ||
      input.currentHeight !== undefined ||
      input.currentWeight !== undefined ||
      input.currentImc !== undefined ||
      input.birthDate !== undefined ||
      input.sex !== undefined ||
      input.activityLevel !== undefined ||
      input.goal !== undefined;

    if (!hasAnyField) {
      throw new BadRequestException(
        'Informe ao menos um campo para atualizar o perfil.'
      );
    }

    if (input.currentWeight !== undefined && input.currentHeight === undefined) {
      throw new BadRequestException(
        'Para atualizar o peso, a altura também deve ser informada.'
      );
    }

    if (input.currentHeight !== undefined && input.currentWeight === undefined) {
      throw new BadRequestException(
        'Para atualizar a altura, o peso também deve ser informado.'
      );
    }

    if (input.currentImc !== undefined && 
        (input.currentHeight === undefined || input.currentWeight === undefined)) {
      throw new BadRequestException(
        'Para atualizar o IMC, é necessário informar altura e peso.'
      );
    }
  }
}