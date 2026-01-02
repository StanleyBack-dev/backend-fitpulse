import { IsString, IsOptional } from 'class-validator';

export class GoogleAuthInputDto {
  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  scope?: string;

  @IsOptional()
  @IsString()
  authuser?: string;

  @IsOptional()
  @IsString()
  prompt?: string;
}