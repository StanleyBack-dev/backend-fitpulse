// LIBS
import { Module } from '@nestjs/common';
import { forwardRef } from '@nestjs/common';

// MODULES
import { UsersModule } from '../users/users.module';
import { SessionsModule } from '../sessions/sessions.module';

// SERVICES
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';
import { GoogleAuthService } from './services/google-auth.service';
import { TokenValidationService } from './services/token-validation.service';

// CONTROLLERS
import { AuthController } from './controllers/auth.controller';
import { LogoutController } from './controllers/logout.controller';
import { RefreshTokenController } from './controllers/refresh-token.controller';


@Module({
  imports: [
    forwardRef(() => UsersModule),
    SessionsModule,
  ],
  controllers: [
    AuthController, 
    LogoutController, 
    RefreshTokenController
  ],
  providers: [
    AuthService,
    TokenValidationService,
    GoogleAuthService,
    TokenService,
  ],
  exports: [AuthService, TokenValidationService],
})

export class AuthModule {}