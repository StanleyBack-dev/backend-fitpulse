import { InputType, Field, Float } from '@nestjs/graphql';
import { IsUUID, IsOptional, IsNumber, IsString, Min, Max, IsDateString } from 'class-validator';

@InputType()
export class UpdateHealthInputDto {
  @Field()
  @IsUUID()
  idHealth: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(50)
  @Max(250)
  heightCm?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(20)
  @Max(300)
  weightKg?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  observation?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  measurementDate?: Date;
}