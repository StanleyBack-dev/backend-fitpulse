// LIBS
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

// INTERCEPTORS
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { RefreshTokenInterceptor } from './common/interceptors/refresh-token.interceptor';
import { RequestInfoInterceptor } from './common/interceptors/request-info.interceptors';

// MODULES
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProfilesModule } from './modules/profiles/profile.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { AppConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';

// GUARDS
import { AuthGuard } from './common/guards/auth.guards';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),
      playground: true,
      context: ({ req, res }) => ({ req, res }),
    }),
    AuthModule,
    UsersModule,
    ProfilesModule,
    SessionsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
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

export class AppModule {}