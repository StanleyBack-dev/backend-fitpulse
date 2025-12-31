import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfileEntity } from '../../entities/profile.entity';
import { UserEntity } from '../../../users/entities/user.entity';
import { GetProfileInputDto } from '../../dtos/get/get-profile-input.dto';
import { GetProfileResponseDto } from '../../dtos/get/get-profile-response.dto';
import { GetProfileValidator } from '../../validators/get/get-profile.validator';

@Injectable()
export class GetProfileService {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // BUSCA PERFIL PELO ID DO USUÁRIO
  async findByUser(userId: string): Promise<GetProfileResponseDto> {
    const profile = await this.profileRepository.findOne({
      where: { user: { idUsers: userId } },
      relations: ['user'],
    });

    if (!profile) {
      throw new NotFoundException('Perfil não encontrado para este usuário.');
    }

    return {
      idProfiles: profile.idProfiles,
      idUsers: profile.user.idUsers,
      phone: profile.phone,
      heightCm: profile.heightCm,
      weightKg: profile.weightKg,
      birthDate: profile.birthDate,
      sex: profile.sex,
      activityLevel: profile.activityLevel,
      goal: profile.goal,
      ipAddress: profile.ipAddress,
      userAgent: profile.userAgent,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }

  // BUSCA PERFIL PELO ID DO PERFIL OU ID DO USUÁRIO
  async findOne(input: GetProfileInputDto): Promise<GetProfileResponseDto> {
    GetProfileValidator.ensureValidInput(input);

    const profile = await this.profileRepository.findOne({
      where: [
        { idProfiles: input.idProfiles },
        { user: { idUsers: input.idUsers } },
      ],
      relations: ['user'],
    });

    if (!profile) {
      throw new NotFoundException('Perfil não encontrado.');
    }

    return {
      idProfiles: profile.idProfiles,
      idUsers: profile.user.idUsers,
      phone: profile.phone,
      heightCm: profile.heightCm,
      weightKg: profile.weightKg,
      birthDate: profile.birthDate,
      sex: profile.sex,
      activityLevel: profile.activityLevel,
      goal: profile.goal,
      ipAddress: profile.ipAddress,
      userAgent: profile.userAgent,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }
}