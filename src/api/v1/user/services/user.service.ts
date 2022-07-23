import { Injectable } from '@nestjs/common';
import { PaginationResDTO } from 'src/common/models/res/pagination.res.dto';
import { ERROR } from 'src/error/exceptions/error.list';
import { PrismaService } from 'src/providers/prisma/services/prisma.service';
import QueryBuilderService from 'src/utils/query.builder';
import { LoginByEmail_POST_DTO } from '../../auth/models/req/login_by_email.post.dto';
import { UserList_GET_DTO } from '../models/req/userlist_get.dto';
import { UserDetail_GET_RES_DTO } from '../models/res/user_detail_get.res.dto';
import { User_POST_DTO } from '../models/req/user_post.dto';
const crypto = require('crypto');

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getById(id: string, includes?: any): Promise<UserDetail_GET_RES_DTO> {
    const query: any = QueryBuilderService.buildFindUnique('userId', id, includes);
    const user = await this.prisma.user.findUnique(query);

    if (!user) {
      throw ERROR.NOT_FOUND_USER;
    }

    return {
      ...user,
    };
  }

  async query(query: UserList_GET_DTO): Promise<PaginationResDTO<any>> {
    const listQuery = QueryBuilderService.buildQueryWhere(query);
    const countQuery = QueryBuilderService.buildCount(query);
    const [totalCount, list] = await this.prisma.$transaction([
      this.prisma.user.count({
        ...countQuery,
      }),
      this.prisma.user.findMany({
        ...listQuery,
      }),
    ]);

    return {
      totalCount: totalCount,
      list: list,
    };
  }

  async create(userInfo: User_POST_DTO, niceIdentify?: any): Promise<UserDetail_GET_RES_DTO> {
    const data = {
      ...userInfo,
    };

    //추후에 Nice랑 이메일용 분기
    if (niceIdentify) {
      /*   data.niceIdentify = {
        create: niceIdentify,
      };*/
    } else {
      const { password, salt } = await this.createHashedPassword(data.password);
      data.password = password;
      data.salt = salt;
    }

    const createUser = await this.prisma.user.create({
      data,
    });

    return createUser;
  }
  async createSalt() {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(64, (err, buf) => {
        if (err) reject(err);
        resolve(buf.toString('base64'));
      });
    });
  }

  async createHashedPassword(plainPassword: string, salt?: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const newSalt: any = salt ?? (await this.createSalt());
      crypto.pbkdf2(plainPassword, newSalt, 9999, 64, 'sha512', (err, key) => {
        if (err) reject(err);
        resolve({ password: key.toString('base64'), newSalt });
      });
    });
  }

  async findByEmail(email: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw ERROR.NOT_FOUND_USER;
    }

    return user;
  }

  async loginByEamil(loginData: LoginByEmail_POST_DTO): Promise<any> {
    const { email, password } = loginData;
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw ERROR.LOGIN_FAIL;
    }
    const hashedPassword = await this.createHashedPassword(password, user.salt);
    const success = hashedPassword === user.password;
    if (!success) {
      throw ERROR.LOGIN_FAIL;
    }
    return user;
  }

  async delete(id: string, data: any, isSoftDelete: boolean): Promise<any> {
    if (isSoftDelete) {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });
      if (!user) {
        throw ERROR.NOT_FOUND_USER;
      }

      await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          deletedAt: new Date(),
        },
      });
    } else {
      await this.prisma.user.delete({
        where: {
          id,
        },
      });
    }
    return true;
  }
}
