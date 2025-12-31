import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UpdateUserService } from '../../services/update/update-user.service';
import { UpdateUserInputDto } from '../../dtos/update/update-user-input.dto';
import { UpdateUserResponseDto } from '../../dtos/update/update-user-response.dto';

@Resolver()
export class UpdateUserResolver {
  constructor(private readonly updateUserService: UpdateUserService) {}

  @Mutation(() => UpdateUserResponseDto)
  async updateUser(
    @Args('input') input: UpdateUserInputDto,
  ): Promise<UpdateUserResponseDto> {
    return this.updateUserService.execute(input);
  }
}