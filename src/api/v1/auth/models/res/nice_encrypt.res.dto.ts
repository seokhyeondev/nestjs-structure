import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class NiceEncrypt_RES_DTO {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sRtnMSG: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  sEncData: string;
}
