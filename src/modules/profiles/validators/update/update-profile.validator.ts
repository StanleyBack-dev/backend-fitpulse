import { BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProfileEntity } from '../../entities/profile.entity';
import { UpdateProfileInputDto } from '../../dtos/update/update-profile-input.dto';

export class UpdateProfileValidator {
  static ensureHasFields(input?: UpdateProfileInputDto): void {
    if (!input) {
      throw new BadRequestException('Nenhum dado foi fornecido para atualização.');
    }

    const hasField = Object.values(input).some((value) => value !== undefined && value !== null);
    if (!hasField) {
      throw new BadRequestException('É necessário fornecer pelo menos um campo para atualizar.');
    }
  }

  static validateEnums(input: UpdateProfileInputDto): void {
    const sexOptions = ['male', 'female', 'other'];
    const activityOptions = ['sedentary', 'light', 'moderate', 'active', 'very_active'];
    const goalOptions = ['lose_weight', 'maintain', 'gain_weight'];

    if (input.sex && !sexOptions.includes(input.sex)) {
      throw new BadRequestException(`sex inválido. Opções válidas: ${sexOptions.join(', ')}`);
    }

    if (input.activityLevel && !activityOptions.includes(input.activityLevel)) {
      throw new BadRequestException(`activityLevel inválido. Opções válidas: ${activityOptions.join(', ')}`);
    }

    if (input.goal && !goalOptions.includes(input.goal)) {
      throw new BadRequestException(`goal inválido. Opções válidas: ${goalOptions.join(', ')}`);
    }
  }

  static validate(input: UpdateProfileInputDto): void {
    this.ensureHasFields(input);
    this.validateEnums(input);
  }

  static async ensureProfileExists(
    userId: string,
    profileRepo: Repository<ProfileEntity>
  ): Promise<ProfileEntity> {
    const profile = await profileRepo.findOne({
      where: { user: { idUsers: userId } },
      relations: ['user'],
    });

    if (!profile) {
      throw new NotFoundException('Perfil não encontrado para este usuário.');
    }

    if (profile.user.idUsers !== userId) {
      throw new ForbiddenException('Você não tem permissão para editar este perfil.');
    }

    return profile;
  }
}