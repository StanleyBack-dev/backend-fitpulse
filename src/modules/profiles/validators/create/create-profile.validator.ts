import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from '../../entities/profile.entity';
import { UserEntity } from '../../../users/entities/user.entity';
import { CreateProfileInputDto } from '../../dtos/create/create-profile-input.dto';

@Injectable()
export class CreateProfileValidator {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  static ensureValidInput(input: Partial<CreateProfileInputDto> & { idUsers?: string }): void {
    if (!input.idUsers) {
      throw new BadRequestException('O ID do usuário é obrigatório para criar um perfil.');
    }
  }

  async ensureUserExists(idUsers: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { idUsers } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    return user;
  }

  async ensureUserHasNoProfile(idUsers: string): Promise<void> {
    const existing = await this.profileRepository.findOne({
      where: { user: { idUsers } },
    });
    if (existing) {
      throw new BadRequestException('Este usuário já possui um perfil cadastrado.');
    }
  }
}