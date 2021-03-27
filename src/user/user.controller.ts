import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { Public } from 'src/utils/decorator';
import {UserEntity} from './user.entity';
import { UserService } from './user.service';
@Controller('user')
export class UserController {
	constructor(private readonly usersService: UserService, private readonly authService: AuthService) {}
  @Public()
  @Post('login')
  async login(@Body() loginParmas: any) {
    console.log('JWT验证 - Step 1: 用户请求登录');
    const authResult = await this.authService.validateUser(loginParmas.user, loginParmas.pass);
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
  @Get('create')
  async create(): Promise<UserEntity> {
    console.log(123);
    const data = {
      user: 123,
      user_type: 0,
      user_data: '{}',
      pass: '123'
    }
    return this.usersService.create(data)
  }
  // @UseGuards(AuthGuard('jwt'))
  @Post('update')
  update(@Body() user, @Request() req){
    return '123';
    return this.usersService.update(user)
  }
  @Public()
  @Post('register')
  async register(@Body() body: any) {
    return await this.usersService.register(body);
  }
}
