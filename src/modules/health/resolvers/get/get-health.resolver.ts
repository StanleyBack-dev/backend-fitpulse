import { Resolver, Query, Args } from '@nestjs/graphql';
import { GetHealthService } from '../../services/get/get-health.service';
import { GetHealthInputDto } from '../../dtos/get/get-health-input.dto';
import { GetHealthResponseDto } from '../../dtos/get/get-health-response.dto';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';

@Resolver()
export class GetHealthResolver {
  constructor(private readonly getHealthService: GetHealthService) {}

  @Query(() => [GetHealthResponseDto])
  async getHealthHistory(
    @CurrentUser() user: any,
    @Args('input', { nullable: true }) input?: GetHealthInputDto,
  ): Promise<GetHealthResponseDto[]> {
    return this.getHealthService.findAll(user.idUsers, input);
  }
}