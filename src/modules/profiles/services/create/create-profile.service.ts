import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfileEntity } from '../../entities/profile.entity';
import { UserEntity } from '../../../users/entities/user.entity';
import { CreateProfileInputDto } from '../../dtos/create/create-profile-input.dto';
import { CreateProfileResponseDto } from '../../dtos/create/create-profile-response.dto';
import { CreateProfileValidator } from '../../validators/create/create-profile.validator';

@Injectable()
export class CreateProfileService {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async execute(
    input: CreateProfileInputDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<CreateProfileResponseDto> {

    CreateProfileValidator.ensureValidInput(input);

    const user = await this.userRepository.findOne({
      where: { idUsers: input.idUsers },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const existingProfile = await this.profileRepository.findOne({
      where: { user: { idUsers: input.idUsers } },
    });

    if (existingProfile) {
      throw new BadRequestException('Este usuário já possui um perfil cadastrado.');
    }

    const profile = this.profileRepository.create({
      phone: input.phone,
      heightCm: input.heightCm,
      weightKg: input.weightKg,
      birthDate: input.birthDate ? new Date(input.birthDate) : undefined,
      sex: input.sex,
      activityLevel: input.activityLevel,
      goal: input.goal,
      ipAddress,
      userAgent,
      user,
    });

    const saved = await this.profileRepository.save(profile);

    return {
      idProfiles: saved.idProfiles,
      idUsers: user.idUsers,
      phone: saved.phone,
      heightCm: saved.heightCm,
      weightKg: saved.weightKg,
      birthDate: saved.birthDate,
      sex: saved.sex,
      activityLevel: saved.activityLevel,
      goal: saved.goal,
      ipAddress: saved.ipAddress,
      userAgent: saved.userAgent,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
    };
  }
}