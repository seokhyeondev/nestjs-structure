import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class Login_RES_DTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  access_token: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  refresh_token?: string;
}
