import { InputType, Field } from '@nestjs/graphql';
import {
  IsUUID,
  IsOptional,
  IsInt,
  IsEnum,
  IsDateString,
  IsNumber,
  IsPhoneNumber,
  Min,
  Max
} from 'class-validator';

@InputType()
export class CreateProfileInputDto {

  @Field()
  @IsUUID()
  idUsers: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsPhoneNumber('BR')
  phone?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  @Min(50)
  @Max(250)
  heightCm?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(20)
  @Max(500)
  weightKg?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEnum(['male', 'female', 'other'])
  sex?: 'male' | 'female' | 'other';

  @Field({ nullable: true })
  @IsOptional()
  @IsEnum(['sedentary', 'light', 'moderate', 'active', 'very_active'])
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

  @Field({ nullable: true })
  @IsOptional()
  @IsEnum(['lose_weight', 'maintain', 'gain_weight'])
  goal?: 'lose_weight' | 'maintain' | 'gain_weight';
}