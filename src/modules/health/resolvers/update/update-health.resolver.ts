import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UpdateHealthService } from '../../services/update/update-health.service';
import { UpdateHealthInputDto } from '../../dtos/update/update-health-input.dto';
import { UpdateHealthResponseDto } from '../../dtos/update/update-health-response.dto';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';

@Resolver()
export class UpdateHealthResolver {
  constructor(private readonly updateHealthService: UpdateHealthService) {}

  @Mutation(() => UpdateHealthResponseDto)
  async updateHealthRecord(
    @CurrentUser() user: any,
    @Args('input') input: UpdateHealthInputDto,
  ): Promise<UpdateHealthResponseDto> {
    return this.updateHealthService.execute(user.idUsers, input);
  }
}