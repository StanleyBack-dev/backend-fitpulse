import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { Public } from "../../../../common/decorators/public.decorator";
import { RequestInfo } from "../../../../common/decorators/request-info.decorator";
import { CreateProfileService } from "../../services/create/create-profile.service";
import { CreateProfileInputDto } from "../../dtos/create/create-profile-input.dto";
import { CreateProfileResponseDto } from "../../dtos/create/create-profile-response.dto";

@Resolver()
export class CreateProfileResolver {
  constructor(private readonly createProfileService: CreateProfileService) {}

  @Public()
  @Mutation(() => CreateProfileResponseDto)
  async createProfile(
    @Args("input") input: CreateProfileInputDto,
    @RequestInfo() requestInfo: { ipAddress?: string; userAgent?: string }
  ): Promise<CreateProfileResponseDto> {
    return this.createProfileService.execute(
      input,
      requestInfo?.ipAddress,
      requestInfo?.userAgent
    );
  }
}