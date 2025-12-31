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

    const token = req.cookies?.[REFRESH_TOKEN_COOKIE_NAME]; 

    if (!token) return res.status(400).json({ authenticated: false });

    try {
      await this.tokenValidation.validateRefreshToken(token);
      const { accessToken } = await this.authService.refreshSession(token);
      return res.json({ authenticated: true, accessToken });
    } catch {

      return res.status(401).json({ authenticated: false });
    }
  }
}