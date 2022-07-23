import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsOptional, IsString, IsNotEmpty, IsJSON, IsDate, IsObject } from 'class-validator';
import dtoBase from './base.dto';

export default class Notification_POST_DTO extends dtoBase {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ each: true })
  users: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  topic: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  tag: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  data?: { [key: string]: any };

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  sendTime: Date;
}
