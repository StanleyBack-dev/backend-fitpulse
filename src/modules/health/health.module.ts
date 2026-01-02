// LIBS
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// ENTITIES
import { HealthEntity } from './entities/health.entity';
import { UserEntity } from '../users/entities/user.entity';

// SERVICES
import { CreateHealthService } from './services/create/create-health.service';
import { GetHealthService } from './services/get/get-health.service';
import { UpdateHealthService } from './services/update/update-health.service';

// RESOLVERS
import { GetHealthResolver } from './resolvers/get/get-health.resolver';
import { CreateHealthResolver } from './resolvers/create/create-health.resolver';
import { UpdateHealthResolver } from './resolvers/update/update-health.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([HealthEntity, UserEntity])],
  providers: [CreateHealthService, CreateHealthResolver, GetHealthService, GetHealthResolver, UpdateHealthService, UpdateHealthResolver ],
  exports: [CreateHealthService, GetHealthService],
})

export class HealthModule {}