import { Injectable, BadRequestException } from '@nestjs/common';
import { RevokeSessionService as DbRevokeService } from '../../sessions/services/revoke/revoke-session.service';

@Injectable()
export class RevokeSessionService {
  constructor(private readonly dbRevokeService: DbRevokeService) {}

  async execute(refreshToken: string) {
    if (!refreshToken) throw new BadRequestException('Token ausente.');
    return this.dbRevokeService.execute(refreshToken);
  }
}