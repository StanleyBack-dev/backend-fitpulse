import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { RequestInfo } from '../../../common/decorators/request-info.decorator';

import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  async loginWithGoogle(
    @Body() body: any,
    @RequestInfo() requestInfo: { ipAddress?: string; userAgent?: string },
  ) {
    return this.authService.loginWithGoogle(
      body,
      requestInfo?.ipAddress,
      requestInfo?.userAgent,
    );
  }

  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshSession(refreshToken);
  }

  @Post('revoke')
  async revoke(@Body('refreshToken') refreshToken: string) {
    return this.authService.revokeSession(refreshToken);
  }
}