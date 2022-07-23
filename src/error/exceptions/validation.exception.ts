import { HttpException, HttpStatus, ValidationError } from '@nestjs/common';
import { ERROR } from './error.list';

export class ValidationErrorException extends HttpException {
  public errorCode: number;

  constructor(errors: ValidationError[]) {
    super('', HttpStatus.BAD_REQUEST);
    this.message = this.getErrorMsg(errors);
    this.errorCode = ERROR.VALIDATION_ERROR.errorCode;
  }

  private getErrorMsg(errors: ValidationError[]) {
    const ko_name = 'test';
    // const constraintsKey = Object.keys(err.constraints)[0];
    const target = errors[0].target.constructor.name;
    let msg = `target : ${target}\n`;
    errors.map(err => {
      const constraintsKey = Object.keys(err.constraints)[0];
      const errorMsg = err.constraints[constraintsKey];
      console.info('errorMsg', errorMsg);
      msg += errorMsg + '\n';
    });

    console.info(errors);
    console.info(msg);
    /*msg += err.constraints[constraintsKey];
    console.info(constraintsKey);
    console.info(err);*/
    return msg;
    /* switch (constraintsKey) {
      case 'maxLength': {
        const _length = msg.substring(msg.indexOf('equal to ') + 8, msg.lastIndexOf(' characters'));
        return `${ko_name}은(는) ${_length}자까지 가능합니다.`;
      }
      case 'minLength': {
        const _length = msg.substring(msg.indexOf('equal to ') + 8, msg.lastIndexOf(' characters'));
        return `${ko_name}은(는) 최소 ${_length}자를 입력해주세요.`;
      }
      case 'isNotEmpty': {
        return `${ko_name}을(를) 입력해주세요.`;
      }
      case 'whitelistValidation': {
        console.log(err);
        return `누락된 필드 혹은 잘못된 필드가 존재합니다.`;
      }
      default:
        return `오류가 발생했습니다.\n${constraintsKey}`;
    }*/
  }
}
