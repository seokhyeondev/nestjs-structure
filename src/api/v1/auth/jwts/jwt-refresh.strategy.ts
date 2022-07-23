import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../services/auth.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private readonly configService: ConfigService, private readonly authService: AuthService, private readonly jwtService: JwtService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          return request?.cookies?.refresh_token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_ACCESS_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req, payload: any) {
    const refresh_token = req.cookies?.refresh_token;
    if (!payload || !refresh_token) return null;
    const result = await this.authService.checkRefreshToken(payload.userId, refresh_token);
    if (result) {
      return { nick: payload.nick, userId: payload.userId, isAdmin: payload.isAdmin, mdId: payload.mdId };
    } else {
      return null;
    }
  }
}
