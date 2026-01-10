import { InputType, Field, Int, Float } from '@nestjs/graphql';
import {
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsDateString,
  IsString,
  IsInt,
} from 'class-validator';

@InputType()
export class CreateHealthInputDto {
  @Field(() => Int)
  @IsInt()
  @Min(50)
  @Max(250)
  heightCm: number;

  @Field(() => Float)
  @IsNumber()
  @Min(20)
  @Max(300)
  weightKg: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  observation?: string;

  @Field()
  @IsDateString()
  measurementDate: string;
}