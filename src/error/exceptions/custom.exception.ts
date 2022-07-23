import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomErrorException extends HttpException {
  public errorCode: number;

  constructor(errorMsg: string, errorCode: number, status?: HttpStatus) {
    super(errorMsg, status || HttpStatus.BAD_REQUEST);
    this.errorCode = errorCode;
  }
}
