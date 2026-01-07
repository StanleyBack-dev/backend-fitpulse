import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { REFRESH_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_OPTIONS } from '../../../config/cookie.config';

@Controller('api/auth/logout')
export class LogoutController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async logout(
    @Body('refreshToken') refreshTokenBody: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const token = req.cookies?.[REFRESH_TOKEN_COOKIE_NAME] || refreshTokenBody;

    if (token) await this.authService.revoke(token);

    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
      ...REFRESH_TOKEN_COOKIE_OPTIONS,
      maxAge: 0,
    });

    res.status(200).json({ success: true });
  }
}