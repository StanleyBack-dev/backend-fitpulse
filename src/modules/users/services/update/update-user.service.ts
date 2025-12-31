import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../entities/user.entity';
import { UpdateUserInputDto } from '../../dtos/update/update-user-input.dto';
import { UpdateUserValidator } from '../../validators/update/update-user-validator';

@Injectable()
export class UpdateUserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  async execute(input: UpdateUserInputDto) {
    UpdateUserValidator.ensureValidUpdate(input);

    const user = await this.repo.findOne({
      where: { idUsers: input.idUsers },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    if (input.name !== undefined) user.name = input.name;
    if (input.urlAvatar !== undefined) user.urlAvatar = input.urlAvatar;

    if (input.status !== undefined) {
      user.status = input.status;
      user.inactivatedAt = input.status ? undefined : new Date();
    }

    return this.repo.save(user);
  }
}