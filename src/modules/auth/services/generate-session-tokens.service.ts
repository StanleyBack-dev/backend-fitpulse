import { Injectable } from '@nestjs/common';
import { addDays } from 'date-fns';
import { TokenService } from './token.service';
import { CreateSessionService } from '../../sessions/services/create/create-session.service';

@Injectable()
export class GenerateSessionTokensService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly createSessionService: CreateSessionService,
  ) {}

  async execute(user: any, ip?: string, agent?: string) {
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
      ipAddress: ip,
      userAgent: agent,
      refreshTokenExpiresAt: addDays(new Date(), 30),
      sessionActive: true,
    });

    return { accessToken, refreshToken };
  }
}