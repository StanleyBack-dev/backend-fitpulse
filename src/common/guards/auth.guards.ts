import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { TokenValidationService } from '../../modules/auth/services/token-validation.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { REFRESH_TOKEN_COOKIE_NAME } from '../../config/cookie.config'; 

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly tokenValidator: TokenValidationService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Verifica se a rota é pública
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    // 2. Detecta o contexto (GraphQL ou HTTP)
    const request = this.getRequest(context);

    // --- ESTRATÉGIA DE VALIDAÇÃO HÍBRIDA ---

    // CENÁRIO A: Tem Header Authorization? (Usado geralmente por APIs externas ou Mobile Nativo)
    const authHeader = request.headers['authorization'];
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      try {
        // Se veio do Header, assumimos que é um ACCESS TOKEN (curta duração)
        const user = await this.tokenValidator.validateAccessToken(token);
        request.user = user;
        return true;
      } catch {
        throw new ForbiddenException('Access Token inválido ou expirado.');
      }
    }

    // CENÁRIO B: Tem Cookie? (Usado pelo seu Frontend Web Next.js)
    // Se não tinha header, procuramos o cookie
    const cookieToken = request.cookies?.[REFRESH_TOKEN_COOKIE_NAME] || request.cookies?.['refreshToken'];
    
    if (cookieToken) {
      try {
        // Se veio do Cookie, sabemos que é um REFRESH TOKEN (longa duração)
        // Então usamos o validador de Refresh Token
        const user = await this.tokenValidator.validateRefreshToken(cookieToken);
        
        // Dica: Refresh Tokens geralmente retornam o user completo com as relações de sessão.
        // Se o objeto for muito complexo, você pode filtrar aqui apenas o ID e Email.
        request.user = user; 
        return true;
      } catch (err) {
        // Se o refresh token do cookie não for válido, forçamos logout (401)
        throw new UnauthorizedException('Sessão expirada. Faça login novamente.');
      }
    }

    // CENÁRIO C: Não tem nem Header nem Cookie
    throw new ForbiddenException('Token não informado.');
  }

  // Método auxiliar mantido (está correto)
  private getRequest(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context);
    const gqlReq = gqlContext.getContext()?.req;
    if (gqlReq) return gqlReq;
    return context.switchToHttp().getRequest();
  }
}