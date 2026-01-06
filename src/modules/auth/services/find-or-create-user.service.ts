import { Injectable, BadRequestException } from '@nestjs/common';
import { GetUsersService } from '../../users/services/get/get-users.service';
import { CreateUserService } from '../../users/services/create/create-user.service';
import { UpdateUserLoginService } from '../../users/services/update/update-user-login.service';

@Injectable()
export class FindOrCreateUserService {
  constructor(
    private readonly getUsersService: GetUsersService,
    private readonly createUserService: CreateUserService,
    private readonly updateUserLoginService: UpdateUserLoginService,
  ) {}

  async execute(googleUser: any, ip?: string, agent?: string) {
    const { id, sub, email, name, picture } = googleUser;
    const idGoogle = id || sub;
    if (!idGoogle || !email) throw new BadRequestException('Dados inválidos.');

    let user = await this.getUsersService.findByGoogleId(idGoogle);

    if (!user) {
      const userByEmail = await this.getUsersService.findByEmail(email);
      if (userByEmail) {
        user = await this.updateUserLoginService.linkGoogleAccount({
          user: userByEmail,
          idGoogle,
          picture,
          ipAddress: ip,
          userAgent: agent,
        });
      } else {
        user = await this.createUserService.execute({
          idGoogle,
          name,
          email,
          urlAvatar: picture,
          status: true,
          ipAddress: ip,
          userAgent: agent,
        });
      }
    } else {
      user = await this.updateUserLoginService.updateLogin(user, ip, agent);
    }

    return user;
  }
}