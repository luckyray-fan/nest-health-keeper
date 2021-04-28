import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  HttpService,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { USER_SOURCE, USER_TYPE } from 'src/common/constant';
import { WXDataCrypt } from 'src/utils/cryptogram';
import { Public } from 'src/utils/decorator';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
@Controller('user')
export class UserController {
  constructor(
    private readonly usersService: UserService,
    private readonly authService: AuthService,
    private httpService: HttpService,
    @InjectRepository(UserEntity)
	  private readonly userRepository: Repository<UserEntity>,
  ) {}
  @Public()
  @Post('login')
  async login(@Body() loginParmas: any, isUpdate?) {
    if (isUpdate) {
      return this.authService.certificate({ user: loginParmas });
    }
    console.log('JWT验证 - Step 1: 用户请求登录');
    const authResult = await this.authService.validateUser(
      loginParmas.user,
      loginParmas.pass,
    );
    switch (authResult.code) {
      case 0:
        return this.authService.certificate(authResult);
      default:
        return {
          code: 400,
          msg: authResult.msg,
        };
    }
  }
  @Public()
  @Post('wxlogin')
  async wxlogin(@Body() body: any) {
    console.log(body);
    const appid = 'wxb1eb11cbeccb04cf';
    const code = body.code;
    const res = await this.httpService.get(
      `https://api.weixin.qq.com/sns/jscode2session?appid=wxb1eb11cbeccb04cf&secret=6ec456683d4d882216ae6303766e6c6a&js_code=${code}&grant_type=authorization_code`,
    ).toPromise();
    const data = res.data;
    console.log(data);
    const pc = new WXDataCrypt(appid, data.session_key)
    const decodeData = pc.decryptData(body.encryptedData, body.iv);
    let user = await this.userRepository.findOne({open_id: data.open_id})
    if(!user){
      user = {
        open_id: data.open_id,
        user_source: USER_SOURCE.wx,
        user_type: USER_TYPE.user,
        user_data: {
          nick: decodeData.nickName,
          avatar: decodeData.avatarUrl
        }
      } as any
      await this.userRepository.save(user);
    }
    return {
      token: await this.authService.wxCertificate(user),
      payload: user
    };
  }
  @Get('create')
  async create(): Promise<UserEntity> {
    console.log(123);
    const data = {
      user: 123,
      user_type: 0,
      user_data: '{}',
      pass: '123',
    };
    return this.usersService.create(data);
  }
  // @UseGuards(AuthGuard('jwt'))
  @Post('update')
  async update(@Body() user, @Request() req) {
    const updateUser = await this.usersService.update(user, req.user.id);
    return this.login(updateUser, true);
  }
  @Post('update/pass')
  async updatePass(@Body() pass, @Request() req) {
    return this.usersService.register({ ...pass, user: req.user.user }, true);
  }
  @Public()
  @Post('register')
  async register(@Body() body: any) {
    return await this.usersService.register(body);
  }
}
