import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class ErrorDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  errorCode: number;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  errorMsg: string;
}
