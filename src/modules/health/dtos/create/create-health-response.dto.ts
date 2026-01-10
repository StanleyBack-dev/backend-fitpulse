import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class CreateHealthResponseDto {
  @Field()
  idHealth: string;

  @Field(() => Int)
  heightCm: number;

  @Field(() => Float)
  weightKg: number;

  @Field(() => Float)
  bmi: number;

  @Field()
  bmiStatus: string;

  @Field({ nullable: true })
  observation?: string;

  @Field()
  measurementDate: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}