import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfileEntity } from '../../entities/profile.entity';
import { CreateProfileValidator } from '../../validators/create/create-profile.validator';
import { CacheDelProvider } from '../../../../common/cache/providers/cache-del.provider';

@Injectable()
export class CreateProfileService {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    private readonly createProfileValidator: CreateProfileValidator,
    private readonly cacheDel: CacheDelProvider,
  ) { }

  async createProfile(
    idUsers: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<ProfileEntity> {
    CreateProfileValidator.ensureValidInput({ idUsers });

    const user = await this.createProfileValidator.ensureUserExists(idUsers);
    await this.createProfileValidator.ensureUserHasNoProfile(idUsers);

    const profile = this.profileRepository.create({
      user,
      phone: undefined,
      birthDate: undefined,
      sex: undefined,
      activityLevel: undefined,
      goal: undefined,
      ipAddress,
      userAgent,
    });

    const saved = await this.profileRepository.save(profile);

    await this.cacheDel.execute(`profile:user:${idUsers}`);

    return saved;
  }
}