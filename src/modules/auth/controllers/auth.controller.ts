import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { Public } from '../../../common/decorators/public.decorator';
import { RequestInfo } from '../../../common/decorators/request-info.decorator';
import { AuthService } from '../services/auth.service';
import { GoogleAuthService } from '../services/google-auth.service';
import { GoogleAuthInputDto } from '../dtos/google-auth-input.dto';
import {
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} from '../../../config/cookie.config';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly googleAuthService: GoogleAuthService,
  ) {}

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

  @Public()
  @Get('callback')
  async googleCallback(
    @Query() query: GoogleAuthInputDto,
    @Req() req: Request,
    @Res() res: Response,
    @RequestInfo() requestInfo: { ipAddress?: string; userAgent?: string },
  ): Promise<void> {
    const googleUser = await this.googleAuthService.exchangeCodeForUser(query.code);

    const { accessToken, refreshToken } = await this.authService.loginWithGoogle(
      googleUser,
      requestInfo?.ipAddress,
      requestInfo?.userAgent,
    );

    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

    const redirectUrl = `${process.env.FRONTEND_URL}/home?token=${accessToken}`;

    res.redirect(redirectUrl);
  }

  // === REFRESH TOKEN ===
  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshSession(refreshToken);
  }

  // === REVOGAR TOKEN ===
  @Post('revoke')
  async revoke(@Body('refreshToken') refreshToken: string) {
    return this.authService.revokeSession(refreshToken);
  }
}