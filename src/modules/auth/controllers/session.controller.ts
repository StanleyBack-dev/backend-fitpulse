import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Controller('api/auth/session')
export class SessionController {
  constructor(private readonly authService: AuthService) {}

  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }

  @Post('revoke')
  async revoke(@Body('refreshToken') refreshToken: string) {
    return this.authService.revoke(refreshToken);
  }
}