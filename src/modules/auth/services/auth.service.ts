import { Injectable } from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service';
import { RefreshSessionService } from './refresh-session.service';
import { RevokeSessionService } from './revoke-session.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly googleAuthService: GoogleAuthService,
    private readonly refreshSessionService: RefreshSessionService,
    private readonly revokeSessionService: RevokeSessionService,
  ) {}

  async loginWithGoogle(code: string, ip?: string, agent?: string) {
    return this.googleAuthService.authenticate(code, ip, agent);
  }

  async refresh(refreshToken: string) {
    return this.refreshSessionService.execute(refreshToken);
  }

  async revoke(refreshToken: string) {
    return this.revokeSessionService.execute(refreshToken);
  }
}