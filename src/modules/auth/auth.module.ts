// LIBS
import { Module } from '@nestjs/common';
import { forwardRef } from '@nestjs/common';

// MODULES
import { UsersModule } from '../users/users.module';
import { SessionsModule } from '../sessions/sessions.module';
import { ProfilesModule } from '../profiles/profile.module';

// SERVICES
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';
import { GoogleAuthService } from './services/google-auth.service';
import { TokenValidationService } from './services/token-validation.service';
import { RefreshSessionService } from './services/refresh-session.service';
import { RevokeSessionService } from './services/revoke-session.service';
import { FindOrCreateUserService } from './services/find-or-create-user.service';
import { GenerateSessionTokensService } from './services/generate-session-tokens.service';

// CONTROLLERS
import { GoogleController } from './controllers/google.controller';
import { LogoutController } from './controllers/logout.controller';
import { RefreshController } from './controllers/refresh.controller';
import { SessionController } from './controllers/session.controller';


@Module({
  imports: [
    forwardRef(() => UsersModule),
    SessionsModule,
    ProfilesModule,
  ],
  controllers: [
    GoogleController, 
    LogoutController, 
    RefreshController,
    SessionController,
  ],
  providers: [
    AuthService,
    TokenValidationService,
    GoogleAuthService,
    RefreshSessionService,
    RevokeSessionService,
    TokenService,
    FindOrCreateUserService,
    GenerateSessionTokensService,
  ],
  exports: [AuthService, TokenValidationService],
})

export class AuthModule {}