import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRole = this.reflector.getAllAndOverride<string>(ROLES_KEY, [context.getHandler(), context.getClass()]);
    //일단 DB에 isAdmin만 있으므로
    //따로 수정 X
    //나중에 필요하면 Roles 세분화
    //requiredRole가 없으면 Admin or 자기자신
    const { user, body } = context.switchToHttp().getRequest();
    console.info('user', user);
    if (requiredRole) {
      return user.isAdmin;
    } else {
      //나중에 바꿀일이 있을 거 같은데 일단 이렇게 수정
      return body.userId ? body.userId === user.userId : true;
    }
  }
}
