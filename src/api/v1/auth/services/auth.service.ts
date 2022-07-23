import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import path from 'path';
import { exec } from 'child_process';
import { NiceEncrypt_RES_DTO } from '../models/res/nice_encrypt.res.dto';
import { ERROR } from 'src/error/exceptions/error.list';
import { PrismaService } from 'src/providers/prisma/services/prisma.service';
import { Login_RES_DTO } from '../models/res/login.res.dto';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async createJWTToken(user: any): Promise<Login_RES_DTO> {
    try {
      let payload: any = {
        nick: user.nickname,
        userId: user.userId,
      };
      if (user.admin) {
        payload = {
          ...payload,
          admin: user.admin,
        };
      }
      if (user.md) {
        payload = {
          ...payload,
          mdId: user.md.id,
        };
      }

      const refresh_token = this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION_DAYS'),
      });
      const access_token = this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION_MINUTES'),
      });
      await this.cacheManager.set(user.userId, refresh_token);

      return {
        access_token,
        refresh_token,
      };
    } catch (e) {
      console.error(e);
      throw ERROR.SERVER_ERROR;
    }
  }

  async checkRefreshToken(userId: string, refresh_token: string): Promise<boolean> {
    const token = await this.cacheManager.get<string>(userId);
    if (!token || token !== refresh_token) {
      return false;
    }
    return true;
  }

  async refreshJWTToken(user: any): Promise<Login_RES_DTO> {
    console.info('refreshJWTToke     n    ', user);
    const newPayload = { nick: user.nick, userId: user.userId, isAdmin: user.isAdmin, mdId: user.mdId };
    const access_token = this.jwtService.sign(newPayload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION_MINUTES'),
    });
    return {
      access_token,
    };
  }

  setToken(res: any, access_token: string, refresh_token?: string) {
    res.cookie('access_token', access_token, {
      path: '/',
    });
    if (refresh_token) {
      res.cookie('refresh_token', refresh_token, {
        path: '/',
      });
    }
  }

  async encryptNiceData(): Promise<NiceEncrypt_RES_DTO> {
    const niceInfo = JSON.parse(this.configService.get('NICE')),
      d = new Date(),
      moduleName = process.env.NODE_ENV == 'development' ? `CPClient${process.platform !== 'win32' ? '_mac' : '.exe'}` : 'CPClient',
      modulePath = path.join(__dirname, '../../../', moduleName),
      sSiteCode = niceInfo.siteCode,
      sSitePW = niceInfo.sitePw,
      sCPRequest = `${sSiteCode}_${d.getTime()}`;
    let sPlaincData = ''; //암호화할 요청 데이터
    let sEncData = ''; //암호화된 요청 데이터 -> response로 보낼 값
    const sAuthType = 'M'; //없으면 기본 선택화면, X: 공인인증서, M: 핸드폰, C: 카드
    const sPopGubun = 'N'; //Y : 취소버튼 있음 / N : 취소버튼 없음
    let sRtnMSG = ''; //에러메시지
    const sReturnUrl = 'http://192.168.0.41:5000/api/v1/auth/nice/decrypt/data'; // 성공시 이동될 URL (방식 : 프로토콜을 포함한 절대 주소)
    const sErrorUrl = 'http://192.168.0.41:5000/api/v1/auth/nice/decrypt/data';
    const sCustomize = '';
    console.info('sCPRequest', modulePath);
    //요청 규격에 맞게 정리
    sPlaincData =
      '7:REQ_SEQ' +
      sCPRequest.length +
      ':' +
      sCPRequest +
      '8:SITECODE' +
      sSiteCode.length +
      ':' +
      sSiteCode +
      '9:AUTH_TYPE' +
      sAuthType.length +
      ':' +
      sAuthType +
      '7:RTN_URL' +
      sReturnUrl.length +
      ':' +
      sReturnUrl +
      '7:ERR_URL' +
      sErrorUrl.length +
      ':' +
      sErrorUrl +
      '9:CUSTOMIZE' +
      sCustomize.length +
      ':' +
      sCustomize;
    console.info('sPlaincData', sPlaincData);
    //nice 모듈을 사용하여 암호화하는 명령
    if (process.platform !== 'win32') {
      exec(`chmod -R 777 ${modulePath}`);
    }
    const cmd = `${modulePath} ENC ${sSiteCode} ${sSitePW} ${sPlaincData}`;
    console.info(cmd);
    //cmd 실행(데이터 암호화)
    try {
      const child = exec(cmd);
      const encode: Promise<string> = new Promise((res, rej) => {
        try {
          child.stdout?.on('data', (data: any): void => {
            console.info('data', data);
            res(data);
          });
        } catch (e) {
          console.error(e);
        }
      });
      sEncData = await encode;
      child.on('close', () => {
        if (sEncData == '-1') {
          sRtnMSG = '암/복호화 시스템 오류입니다.';
        } else if (sEncData == '-2') {
          sRtnMSG = '암호화 처리 오류입니다.';
        } else if (sEncData == '-3') {
          sRtnMSG = '암호화 데이터 오류 입니다.';
        } else if (sEncData == '-9') {
          sRtnMSG = '입력값 오류 : 암호화 처리시, 필요한 파라미터 값을 확인해 주시기 바랍니다.';
        } else {
          sRtnMSG = '';
        }
      });
    } catch (e) {
      console.error(e);

      console.info('sEncData', sEncData);
    }
    console.info('sRtnMSG', sRtnMSG);
    console.info('sEncData', sEncData);
    return {
      sRtnMSG,
      sEncData,
    };
  }

  async decryptNiceData(query: any, body: any): Promise<any> {
    function GetValue(plaindata: string, key: any) {
      const arrData = plaindata.split(':');
      const itemIndex = arrData.findIndex(item => item.indexOf(key) === 0);
      const len = parseInt((arrData[itemIndex] ?? '0').replace(key, ''));

      console.log(arrData[itemIndex + 1].substr(0, len));
      return arrData[itemIndex + 1].substr(0, len);
    }

    const niceInfo = JSON.parse(this.configService.get('NICE')),
      d = new Date(),
      moduleName = process.env.NODE_ENV === 'development' ? `CPClient${process.platform !== 'win32' ? '_mac' : ''}` : 'CPClient',
      modulePath = path.join(__dirname, '../../../', moduleName),
      sSiteCode = niceInfo.siteCode,
      sSitePW = niceInfo.sitePw,
      sCPRequest = `${sSiteCode}_${d.getTime()}`;

    //chrome80 이상 대응
    const sEncData = query.EncodeData || body.EncodeData;
    console.info('decrpy', sEncData);
    let cmd = '';
    try {
      if (/^0-9a-zA-Z+\/=/.test(sEncData) == true) {
        const sRtnMSG = '입력값 오류';
        const requestnumber = '';
        const authtype = '';
        const errcode = '';
        /* response.render('checkplus_fail.ejs', {
          sRtnMSG,
          requestnumber,
          authtype,
          errcode,
        });*/
      }

      if (sEncData != '') {
        cmd = modulePath + ' ' + 'DEC' + ' ' + sSiteCode + ' ' + sSitePW + ' ' + sEncData;
      }

      let sDecData = '';
      let sRtnMSG = '';
      try {
        exec(`chmod -R 777 ${modulePath}`);
        const child = exec(cmd);

        const decodeData: Promise<string> = new Promise((res, rej) => {
          child.stdout?.on('data', (data: any): void => {
            res(data);
          });
        });
        sDecData = await decodeData;
      } catch (e) {
        console.error(e);
      }
      //처리 결과 확인
      if (sDecData == '-1') {
        sRtnMSG = '암/복호화 시스템 오류';
      } else if (sDecData == '-4') {
        sRtnMSG = '복호화 처리 오류';
      } else if (sDecData == '-5') {
        sRtnMSG = 'HASH값 불일치 - 복호화 데이터는 리턴됨';
      } else if (sDecData == '-6') {
        sRtnMSG = '복호화 데이터 오류';
      } else if (sDecData == '-9') {
        sRtnMSG = '입력값 오류';
      } else if (sDecData == '-12') {
        sRtnMSG = '사이트 비밀번호 오류';
      } else {
        //항목의 설명은 개발 가이드를 참조
        const requestId = decodeURIComponent(GetValue(sDecData, 'REQ_SEQ')); //CP요청 번호 , main에서 생성한 값을 되돌려준다. 세션등에서 비교 가능
        const responseId = decodeURIComponent(GetValue(sDecData, 'RES_SEQ')); //고유 번호 , 나이스에서 생성한 값을 되돌려준다.
        const authMethod = decodeURIComponent(GetValue(sDecData, 'AUTH_TYPE')); //인증수단
        const name = decodeURIComponent(GetValue(sDecData, 'UTF8_NAME')); //이름
        const birth = decodeURIComponent(GetValue(sDecData, 'BIRTHDATE')); //생년월일(YYYYMMDD)
        const gender = decodeURIComponent(GetValue(sDecData, 'GENDER')); //성별
        const nationalInfo = decodeURIComponent(GetValue(sDecData, 'NATIONALINFO')); //내.외국인정보
        const duplicateInfo = decodeURIComponent(GetValue(sDecData, 'DI')); //중복가입값(64byte)
        const connectionInfo = decodeURIComponent(GetValue(sDecData, 'CI')); //연계정보 확인값(88byte)
        const mobile = decodeURIComponent(GetValue(sDecData, 'MOBILE_NO')); //휴대폰번호(계약된 경우)
        const mobileCompany = decodeURIComponent(GetValue(sDecData, 'MOBILE_CO')); //통신사(계약된 경우)

        const data = {
          userInfo: {
            name: name,
            birth: parseInt(birth),
            gender: gender === '1' ? 'Male' : 'Female',
            phone: mobile,
          },
          niceIdentify: {
            requestId,
            responseId,
            authMethod,
            nationalInfo,
            duplicateInfo,
            connectionInfo,
            mobile,
            mobileCompany,
          },
        };

        console.info('data', data);
        return {
          userInfo: data.userInfo,
          niceIdentify: data.niceIdentify,
        };
      }
    } catch (e) {
      throw e;
    }
  }
}
