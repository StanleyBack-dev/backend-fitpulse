import { Controller, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { Public } from '../../../common/decorators/public.decorator';
import { TokenValidationService } from '../services/token-validation.service';
import { AuthService } from '../services/auth.service';
import { REFRESH_TOKEN_COOKIE_NAME } from '../../../config/cookie.config';

@Controller('api/auth')
export class RefreshTokenController {
  constructor(
    private readonly tokenValidation: TokenValidationService,
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const cookieToken = req.cookies?.[REFRESH_TOKEN_COOKIE_NAME];
    const bodyToken = req.body?.refreshToken;
    const token = typeof cookieToken === 'string' && cookieToken.trim() !== ''
      ? cookieToken
      : bodyToken;

    console.log('Cookies recebidos:', req.cookies);
    console.log('Token selecionado:', token);

    if (!token || typeof token !== 'string' || token.trim() === '') {
      return res.status(401).json({ authenticated: false });
    }

    try {
      await this.tokenValidation.validateRefreshToken(token);
      const { accessToken } = await this.authService.refreshSession(token);
      return res.json({ authenticated: true, accessToken });
    } catch (err) {
      console.error('Erro no refresh:', err);
      return res.status(401).json({ authenticated: false });
    }
  }
}