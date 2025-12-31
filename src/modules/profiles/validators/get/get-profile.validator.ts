import { BadRequestException } from '@nestjs/common';
import { GetProfileInputDto } from '../../dtos/get/get-profile-input.dto';

export class GetProfileValidator {

  // GARANTE QUE AO MENOS UM IDENTIFICADOR SEJA INFORMADO
  static ensureValidInput(input?: GetProfileInputDto): void {

    if (!input) {
      throw new BadRequestException(
        'Parâmetros de busca não informados.'
      );
    }

    if (!input.idProfiles && !input.idUsers) {
      throw new BadRequestException(
        'Informe o idProfiles ou o idUsers para buscar o perfil.'
      );
    }
  }
}