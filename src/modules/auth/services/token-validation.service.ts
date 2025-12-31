import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenService } from './token.service';
import { GetUsersService } from '../../users/services/get/get-users.service'; 
import { UserValidator } from '../../users/validators/user.validator';

@Injectable()
export class TokenValidationService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly getUsersService: GetUsersService,
  ) {}

  /**
   * Valida um access token e retorna o usuário associado
   */
  async validateAccessToken(token: string) {
    try {
      const payload = this.tokenService.verifyAccessToken(token);
      
      // Usa o GetUsersService para buscar
      const user = await this.getUsersService.findById(payload.sub);
      
      if (!user) {
        throw new UnauthorizedException('Usuário não encontrado.');
      }

      UserValidator.ensureIsActive(user);
      
      return user;
    } catch (err) {
      // Retorna 401 em vez de 500
      throw new UnauthorizedException('Token inválido ou expirado.');
    }
  }

  /**
   * Valida um refresh token e retorna o usuário associado
   */
  async validateRefreshToken(token: string) {
    try {
      const payload = this.tokenService.verifyRefreshToken(token);
      
      // Usa o GetUsersService para buscar
      const user = await this.getUsersService.findById(payload.sub);
      
      if (!user) {
        throw new UnauthorizedException('Usuário não encontrado.');
      } 

      return user;
    } catch (err) {
      throw new UnauthorizedException('Refresh token inválido ou expirado.');
    }
  }
}