import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsUUID, IsDateString } from 'class-validator';

@InputType()
export class GetHealthInputDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  idHealth?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}