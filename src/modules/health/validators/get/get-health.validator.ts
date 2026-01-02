import { BadRequestException } from '@nestjs/common';
import { GetHealthInputDto } from '../../dtos/get/get-health-input.dto';

export class GetHealthValidator {
  static ensureValidDateRange(input: GetHealthInputDto): void {
    if (input.startDate && input.endDate) {
      const start = new Date(input.startDate);
      const end = new Date(input.endDate);

      if (start > end) {
        throw new BadRequestException('A data inicial não pode ser posterior à data final.');
      }
    }
  }
}