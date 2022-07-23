import { HttpException, HttpStatus } from '@nestjs/common';
import { CustomErrorException } from './custom.exception';

export function $_$(errorMsg: string, errorCode: number, statusCode: number) {
  return new CustomErrorException(errorMsg, errorCode, statusCode);
}

/*
  ErrorCode
  100 ~ 200 공용
  200 ~ 300 계정관련
  300 ~ 400 클럽관련
  400 ~ 500 MD관련
  500 ~ 600 라운지 게시글 관련
  600 ~ 700 예약 관련
  700 ~ 800 결제관련
  800 ~ 900 채팅
  900 ~ 1000 신고
*/

export const ERROR = {
  SERVER_ERROR: $_$('서버 오류 발생.', 100, 401),
  UNAUTHORIZED: $_$('인증정보가 필요합니다.', 101, 401),
  FORBIDDEN: $_$('권한 없음', 102, 403),
  NOT_FOUND: $_$('자료를 찾지 못했습니다.', 103, 404),
  WRONG_APPROACH: $_$('잘못된 접근입니다.', 104, 404),
  FORBIDDEN_EXTENSION: $_$('이미지만 업로드 가능합니다.', 105, 404),
  VALIDATION_ERROR: $_$('Validation Error.', 105, 404),

  LOGIN_FAIL: $_$('아이디 또는 비밀번호를 확인해주세요.', 200, 400),
  NOT_FOUND_USER: $_$('아이디를 찾을 수 없습니다.', 201, 400),
  OVER_SMS_TRY_COUNT: $_$('SMS 인증가능 횟수를 초과했습니다.', 202, 400),
  FAIL_SMS: $_$('SMS 문자 발송 실패하였습니다.', 203, 400),
  FAIL_SMS_AUTH: $_$('SMS 인증에 실패했습니다.', 203, 400),

  NOT_FOUND_KLUB: $_$('클럽을 찾을 수 없습니다.', 300, 400),
  EXIST_HOTPLACE: $_$('핫플레이스에 이미 클럽이 존재하거나 순서가 겹칩니다.', 301, 400),
  NOT_FOUND_REVIEW: $_$('리뷰를 찾을 수 없습니다.', 303, 400),

  NOT_FOUND_MD: $_$('MD를 찾을 수 없습니다.', 400, 400),
  EXIST_MD: $_$('이미 존재하는 MD입니다.', 401, 400),

  NOT_FOUND_POST: $_$('게시글을 찾을 수 없습니다.', 500, 400),
  NOT_FOUND_COMMENT: $_$('댓글 찾을 수 없습니다.', 501, 400),

  NOT_FOUND_RESERVATION_INFO: $_$('예약 정보를 찾을 수 없습니다.', 600, 400),
  NOT_FOUND_RESERVATION: $_$('예약 내역을 찾을 수 없습니다.', 601, 400),
  NOT_FOUND_REVERSE_RESERVATION: $_$('역경매 신청 내역을 찾을 수 없습니다.', 602, 400),
  NOT_FOUND_AUCTION: $_$('경매를 찾을 수 없습니다.', 603, 400),
  NOT_FOUND_AUCTION_BID: $_$('경매 참여 내역을 찾을 수 없습니다.', 603, 400),
  BID_HIGHER_PRICE: $_$('더 높은 금액으로 경매 신청해주세요.', 605, 400),
  CLOSE_AUCTION: $_$('마감된 경매입니다.', 605, 400),

  CANNOT_FIND_PAYMENT_PROVIDER: $_$('결제 키를 찾을 수 없습니다.', 701, 400),
  FAILED_PAYMENT: $_$('결제 실패', 702, 400),
  CARD_IS_NOT_VALID: $_$('결제 실패', 703, 400),
  CARD_IS_DUPLICATE: $_$('중복된 카드가 있습니다.', 704, 400),
  INVALIDATE_PAYMENT: $_$('위변조된 결제입니다.', 705, 400),
  NEED_APPLY_CARD: $_$('카드를 등록해 주세요.', 706, 400),

  NOT_PAIED_RECORD: $_$('결제 정보 찾을 수 없음', 731, 400),
  CANNOT_REFUND: $_$('환불에 실패 했습니다.', 751, 400),
  // CANNOT_REFUND: $_$('환불에 실패 했습니다.', 751, 400),

  NOT_FOUND_BIRDVIEW: $_$('조판을 찾을 수 없습니다.', 600, 400),
  NOT_FOUND_TABLEGROUP: $_$('테이블 그룹을 찾을 수 없습니다.', 601, 400),
  NOT_FOUND_TABLE: $_$('테이블을 찾을 수 없습니다.', 602, 400),
  NOT_FOUND_TABLE_PRICE: $_$('실시간 테이블가격을 찾을 수 없습니다.', 603, 400),
  NOT_FOUND_PRICE_GROUP: $_$('실시간 테이블가격을 찾을 수 없습니다.', 604, 400),
  DUPLICATE_PRICE_GROUP_TIME: $_$('이미 등록돼있는 가격표와 시간이 겹칩니다.', 605, 400),

  IMPORT_TOKEN_ERROR: $_$('아임포트 토큰 에러.', 700, 400),
  IMPORT_DATA_ERROR: $_$('아임포트 데이터 에러.', 701, 400),

  NOT_FOUND_CHAT: $_$('채팅방을 찾을 수 없습니다.', 801, 404),
  CHAT_ROOM_IS_CLOSE: $_$('채팅방이 종료되었습니다.', 801, 403),
};
