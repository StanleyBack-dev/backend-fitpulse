import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class GetHealthResponseDto {
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

  @Field(() => String)
  measurementDate: string;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}