import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UpdateUserLoginService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  async updateLogin(
    user: UserEntity,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<UserEntity> {
    user.lastLogin = new Date();
    user.ipAddress = ipAddress;
    user.userAgent = userAgent;

    return this.repo.save(user);
  }

  async linkGoogleAccount(params: {
    user: UserEntity;
    idGoogle: string;
    picture?: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<UserEntity> {
    const { user, idGoogle, picture, ipAddress, userAgent } = params;

    user.idGoogle = idGoogle;
    user.urlAvatar ??= picture;
    user.lastLogin = new Date();
    user.ipAddress = ipAddress;
    user.userAgent = userAgent;

    return this.repo.save(user);
  }
}