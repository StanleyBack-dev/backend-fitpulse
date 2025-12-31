// LIBS
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { addDays } from 'date-fns';

// VALIDATORS
import { UserValidator } from '../../users/validators/user.validator';

// SERVICES
import { TokenService } from './token.service';
import { GoogleAuthService } from './google-auth.service';
import { GetUsersService } from '../../users/services/get/get-users.service';
import { CreateUserService } from '../../users/services/create/create-user.service';
import { UpdateUserLoginService } from '../../users/services/update/update-user-login.service';
import { CreateSessionService } from '../../sessions/services/create/create-session.service';
import { ValidateSessionService } from '../../sessions/services/validate/validate-session.service';
import { RefreshSessionService } from '../../sessions/services/refresh/refresh-session.service';
import { RevokeSessionService } from '../../sessions/services/revoke/revoke-session.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly googleService: GoogleAuthService,

    private readonly getUsersService: GetUsersService,
    private readonly createUserService: CreateUserService,
    private readonly updateUserLoginService: UpdateUserLoginService,

    private readonly createSessionService: CreateSessionService,
    private readonly validateSessionService: ValidateSessionService,
    private readonly refreshSessionService: RefreshSessionService,
    private readonly revokeSessionService: RevokeSessionService,
  ) {}

  async loginWithGoogle(
    googleData: any,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const { id, sub, email, name, picture } = googleData;
    const idGoogle = id || sub;
    if (!idGoogle || !email) throw new BadRequestException();

    let user = await this.getUsersService.findByGoogleId(idGoogle);
    let isNewUser = false;

    if (!user) {
      const userByEmail = await this.getUsersService.findByEmail(email);
      if (userByEmail) {
        user = await this.updateUserLoginService.linkGoogleAccount({
          user: userByEmail,
          idGoogle,
          picture,
          ipAddress,
          userAgent,
        });
      } else {
        isNewUser = true;
        user = await this.createUserService.execute({
          idGoogle,
          name,
          email,
          urlAvatar: picture,
          status: true,
          ipAddress,
          userAgent,
        });
      }
    } else {
      user = await this.updateUserLoginService.updateLogin(
        user,
        ipAddress,
        userAgent,
      );
    }

    if (!user) throw new UnauthorizedException();
    UserValidator.ensureIsActive(user);
    UserValidator.ensureHasEmail(user);

    const accessToken = this.tokenService.generateAccessToken({
      sub: user.idUsers,
      email: user.email,
    });
    const refreshToken = this.tokenService.generateRefreshToken({
      sub: user.idUsers,
    });

    await this.createSessionService.execute({
      user,
      idUsers: user.idUsers,
      refreshToken,
      ipAddress,
      userAgent,
      refreshTokenExpiresAt: addDays(new Date(), 30),
      sessionActive: true,
    });

    return { user, accessToken, refreshToken, isNewUser };
  }

  async refreshSession(refreshToken: string) {
    const payload = this.tokenService.verifyRefreshToken(refreshToken);
    const session = await this.validateSessionService.execute(
      refreshToken,
      payload.sub,
    );
    if (!session) throw new UnauthorizedException();

    await this.refreshSessionService.execute(session);

    return {
      accessToken: this.tokenService.generateAccessToken({
        sub: session.user.idUsers,
        email: session.user.email,
      }),
    };
  }

  async revokeSession(refreshToken: string) {
    return this.revokeSessionService.execute(refreshToken);
  }
}