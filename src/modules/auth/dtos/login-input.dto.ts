import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleAuthInputDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}