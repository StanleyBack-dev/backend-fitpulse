import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class CreateProfileResponseDto {

  @Field()
  idProfiles: string;

  @Field()
  idUsers: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  heightCm?: number;

  @Field({ nullable: true })
  weightKg?: number;

  @Field({ nullable: true })
  birthDate?: Date;

  @Field({ nullable: true })
  sex?: string;

  @Field({ nullable: true })
  activityLevel?: string;

  @Field({ nullable: true })
  goal?: string;

  @Field({ nullable: true })
  ipAddress?: string;

  @Field({ nullable: true })
  userAgent?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}