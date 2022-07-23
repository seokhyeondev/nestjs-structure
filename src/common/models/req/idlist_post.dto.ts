import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class IDList_POST_DTO {
  @ApiProperty()
  @IsString({ each: true })
  ids: string[];
}
