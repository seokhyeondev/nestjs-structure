import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class NiceIdentifyModelDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  requestId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  responseId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  authMethod: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nationalInfo: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  duplicateInfo: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  connectionInfo: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  mobile: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  mobileCompany: string;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  createAt: Date;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  updateAt: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  deleteAt: Date;
}
