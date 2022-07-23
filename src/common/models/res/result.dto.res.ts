import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ResultDTO {
  @IsNotEmpty()
  @IsBoolean()
  success: boolean;
}
