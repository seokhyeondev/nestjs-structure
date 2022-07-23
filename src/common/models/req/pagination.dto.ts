import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import dtoBase from './base.dto';

export default class PaginationDTO extends dtoBase {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  take = 10;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  skip = 0;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  orderByField?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  orderBySort?: string;
}
