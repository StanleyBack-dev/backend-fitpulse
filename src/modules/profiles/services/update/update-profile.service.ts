import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfileEntity } from '../../entities/profile.entity';
import { UserEntity } from '../../../users/entities/user.entity';
import { UpdateProfileInputDto } from '../../dtos/update/update-profile-input.dto';
import { UpdateProfileResponseDto } from '../../dtos/update/update-profile-response.dto';
import { UpdateProfileValidator } from '../../validators/update/update-profile.validator';

@Injectable()
export class UpdateProfileService {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async execute(
    userId: string,
    input: UpdateProfileInputDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<UpdateProfileResponseDto> {

    UpdateProfileValidator.ensureHasFields(input);

    const profile = await this.profileRepository.findOne({
      where: { user: { idUsers: userId } },
      relations: ['user'],
    });

    if (!profile) {
      throw new NotFoundException('Perfil não encontrado para este usuário.');
    }

    if (profile.user.idUsers !== userId) {
      throw new ForbiddenException('Você não tem permissão para editar este perfil.');
    }

    Object.assign(profile, {
      phone: input.phone ?? profile.phone,
      currentWeight: input.currentWeight ?? profile.currentWeight,
      currentHeight: input.currentHeight ?? profile.currentHeight,
      currentImc: input.currentImc ?? profile.currentImc,
      birthDate: input.birthDate ? new Date(input.birthDate) : profile.birthDate,
      sex: input.sex ?? profile.sex,
      activityLevel: input.activityLevel ?? profile.activityLevel,
      goal: input.goal ?? profile.goal,
      ipAddress: ipAddress ?? profile.ipAddress,
      userAgent: userAgent ?? profile.userAgent,
    });

    const updated = await this.profileRepository.save(profile);

    return {
      idProfiles: updated.idProfiles,
      idUsers: updated.user.idUsers,
      phone: updated.phone,
      currentWeight: updated.currentWeight,
      currentHeight: updated.currentHeight,
      currentImc: updated.currentImc,
      birthDate: updated.birthDate,
      sex: updated.sex,
      activityLevel: updated.activityLevel,
      goal: updated.goal,
      ipAddress: updated.ipAddress,
      userAgent: updated.userAgent,
      updatedAt: updated.updatedAt,
    };
  }
}