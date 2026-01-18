// LIBS
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

// INTERCEPTORS
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { RefreshTokenInterceptor } from './common/interceptors/refresh-token.interceptor';
import { RequestInfoInterceptor } from './common/interceptors/request-info.interceptors';

// MODULES
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProfilesModule } from './modules/profiles/profile.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { HealthModule } from './modules/health/health.module';
import { AppConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { AppCacheModule } from './common/cache/cache.modude';
import { MailModule } from './shared/mails/mail.module';

// GUARDS
import { AuthGuard } from './common/guards/auth.guards';
import { RateLimitGuard } from './common/guards/rate-limit.guard';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    AppCacheModule,
    MailModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      context: ({ req, res }) => ({ req, res }),
    }),
    AuthModule,
    UsersModule,
    ProfilesModule,
    SessionsModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RateLimitGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RefreshTokenInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestInfoInterceptor,
    },
  ],
})

export class AppModule { }