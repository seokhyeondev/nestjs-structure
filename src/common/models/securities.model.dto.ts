import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SecuritiesModelDTO {
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
  @IsNumber()
  cashKRW: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  cashUSD: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  flowerKRW: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  flowerUSD: number;
}
