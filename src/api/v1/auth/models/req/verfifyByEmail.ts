import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyByEmail_POST_DTO {
  @IsNotEmpty()
  @IsString()
  email: string;
}
