import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class CreateHealthResponseDto {
  @Field()
  idHealth: string;

  @Field()
  idUsers: string;

  @Field(() => Float)
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
  measurementDate: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}