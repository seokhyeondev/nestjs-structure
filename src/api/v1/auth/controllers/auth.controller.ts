import { All, Body, Controller, Post, Query, Req, Request, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { ResultDTO } from 'src/common/models/res/result.dto.res';
import { TransformInterceptor } from 'src/interceptors/transformInterceptor';
import { UserService } from '../../user/services/user.service';
import { JwtAuthGuard } from '../jwts/jwt-auth.guard';
import { JwtRefreshAuthGuard } from '../jwts/jwt-refresh.guard';
import { LocalAuthGuard } from '../jwts/local-auth.guard';
import { LoginByEmail_POST_DTO } from '../models/req/login_by_email.post.dto';
import { SingUpByEmail_POST_DTO } from '../models/req/signup_email.dto';
import { Login_RES_DTO } from '../models/res/login.res.dto';
import { NiceEncrypt_RES_DTO } from '../models/res/nice_encrypt.res.dto';
import { AuthService } from '../services/auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

  @Post('signup')
  @UseInterceptors(new TransformInterceptor(Login_RES_DTO))
  async singUp(@Res({ passthrough: true }) res, @Body() data: SingUpByEmail_POST_DTO): Promise<Login_RES_DTO> {
    const user = await this.userService.create(data);
    const { access_token, refresh_token } = await this.authService.createJWTToken(user);
    this.authService.setToken(res, access_token, refresh_token);
    return { access_token, refresh_token };
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh_token')
  @ApiBearerAuth()
  @UseInterceptors(new TransformInterceptor(Login_RES_DTO))
  async refreshToken(@Res({ passthrough: true }) res, @Req() req): Promise<any> {
    const { access_token } = await this.authService.refreshJWTToken(req.user);
    this.authService.setToken(res, access_token);
    return {
      access_token,
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginByEmail_POST_DTO })
  @UseInterceptors(new TransformInterceptor(ResultDTO))
  async login(@Request() req, @Res({ passthrough: true }) res): Promise<ResultDTO> {
    const { access_token, refresh_token } = await this.authService.createJWTToken(req.user);
    this.authService.setToken(res, access_token, refresh_token);
    return {
      success: true,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiBody({ type: LoginByEmail_POST_DTO })
  @UseInterceptors(new TransformInterceptor(ResultDTO))
  async logout(@Request() req, @Res({ passthrough: true }) res): Promise<ResultDTO> {
    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('refresh_token', { path: '/' });

    return {
      success: true,
    };
  }

  @All('nice/encrypt/data')
  @UseInterceptors(new TransformInterceptor(NiceEncrypt_RES_DTO))
  async encryptData(@Body() data: any, @Query() query: any): Promise<NiceEncrypt_RES_DTO> {
    return await this.authService.encryptNiceData();
  }

  @All('nice/decrypt/data')
  async decryptData(@Res() res, @Body() data: any, @Query() query: any) {
    try {
      const decryptNiceData = await this.authService.decryptNiceData(query, data);
      const user = await this.userService.create(decryptNiceData.userInfo, decryptNiceData.niceIdentify);
      const result = await this.authService.createJWTToken(user);

      this.authService.setToken(res, result.access_token, result.refresh_token);
      res.redirect(`http://192.168.0.41:3001/login?success=true`);
    } catch (e) {
      console.error(e);
      res.redirect(`http://192.168.0.41:3001/login?error_msg=${'dd'}`);
    }
  }
}
