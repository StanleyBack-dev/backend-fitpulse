// LIBS
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

// ENTITIES
import { ProfileEntity } from "./entities/profile.entity";
import { UserEntity } from "../users/entities/user.entity";

// SERVICES
import { CreateProfileService } from "./services/create/create-profile.service";
import { GetProfileService } from "./services/get/get-profile.service";
import { UpdateProfileService } from "./services/update/update-profile.service";

// RESOLVERS
import { CreateProfileResolver } from "./resolvers/create/create-profile.resolver";
import { GetProfileResolver } from "./resolvers/get/get-profile.resolver";
import { UpdateProfileResolver } from "./resolvers/update/update-profile.resolver";

@Module({
  imports: [TypeOrmModule.forFeature([ProfileEntity, UserEntity])],
  providers: [
    CreateProfileService,
    CreateProfileResolver,
    GetProfileService,
    GetProfileResolver,
    UpdateProfileService,
    UpdateProfileResolver,
  ],
  exports: [CreateProfileService, GetProfileService, UpdateProfileService],
})

export class ProfilesModule {}