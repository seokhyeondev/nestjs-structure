import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorDTO } from '../dto/error.dto';
import { CustomErrorException } from '../exceptions/custom.exception';
import { ValidationErrorException } from '../exceptions/validation.exception';

@Catch(CustomErrorException, ValidationErrorException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: CustomErrorException | ValidationErrorException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const reponseData = new ErrorDTO();

    console.error(exception);
    reponseData.errorCode = exception.errorCode;
    reponseData.errorMsg = exception.message;

    response.status(status).send(reponseData);
  }
}
