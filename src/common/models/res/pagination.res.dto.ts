import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsArray, IsObject } from 'class-validator';

export class PaginationResDTO<T> {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  totalCount: number;

  list: T[];
}
