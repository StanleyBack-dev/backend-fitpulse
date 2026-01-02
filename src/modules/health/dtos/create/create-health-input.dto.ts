import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsNumber, Min, Max, IsDateString, IsString } from 'class-validator';

@InputType()
export class CreateHealthInputDto {
  @Field(() => Float)
  @IsNumber()
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
  measurementDate: Date;
}