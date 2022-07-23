import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';
export class Count_GET_RES_DTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  count: number;
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isLike: boolean;
}
