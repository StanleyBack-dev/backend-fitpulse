import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { TokenService } from './token.service';
import { ValidateSessionService } from '../../sessions/services/validate/validate-session.service';
import { RefreshSessionService as DbRefreshService } from '../../sessions/services/refresh/refresh-session.service';

@Injectable()
export class RefreshSessionService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly validateSessionService: ValidateSessionService,
    private readonly dbRefreshService: DbRefreshService,
  ) {}

  async execute(refreshToken: string) {
    if (!refreshToken) throw new BadRequestException('Token ausente.');

    const payload = this.tokenService.verifyRefreshToken(refreshToken);
    const session = await this.validateSessionService.execute(refreshToken, payload.sub);

    if (!session) throw new UnauthorizedException('Sessão inválida.');

    await this.dbRefreshService.execute(session);

    return this.tokenService.generateAccessToken({
      sub: session.user.idUsers,
      email: session.user.email,
    });
  }
}