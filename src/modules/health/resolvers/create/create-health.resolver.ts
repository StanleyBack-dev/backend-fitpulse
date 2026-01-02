import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { CreateHealthService } from '../../services/create/create-health.service';
import { CreateHealthInputDto } from '../../dtos/create/create-health-input.dto';
import { CreateHealthResponseDto } from '../../dtos/create/create-health-response.dto';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';

@Resolver()
export class CreateHealthResolver {
  constructor(private readonly createHealthService: CreateHealthService) {}

  @Mutation(() => CreateHealthResponseDto)
  async createHealth(
    @CurrentUser() user: any,
    @Args('input') input: CreateHealthInputDto,
  ): Promise<CreateHealthResponseDto> {
    return this.createHealthService.execute(user.idUsers, input);
  }
}