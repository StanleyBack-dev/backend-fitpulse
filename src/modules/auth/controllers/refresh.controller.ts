import { Controller, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { TokenValidationService } from '../services/token-validation.service';
import { AuthService } from '../services/auth.service';
import { REFRESH_TOKEN_COOKIE_NAME } from '../../../config/cookie.config';

@Controller('api/auth/token')
export class RefreshController {
  constructor(
    private readonly tokenValidation: TokenValidationService,
    private readonly authService: AuthService,
  ) {}

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const token =
      req.cookies?.[REFRESH_TOKEN_COOKIE_NAME] ||
      req.body?.refreshToken;

    if (!token || typeof token !== 'string' || token.trim() === '') {
      return res.status(401).json({ authenticated: false });
    }

    try {
      await this.tokenValidation.validateRefreshToken(token);
      const accessToken = await this.authService.refresh(token);
      return res.json({ authenticated: true, accessToken });
    } catch {
      return res.status(401).json({ authenticated: false });
    }
  }
}