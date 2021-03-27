import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { encryptPassword } from '../utils/cryptogram';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UserService, private readonly jwtService: JwtService) {}

  // JWT验证 - Step 2: 校验用户信息
  async validateUser(username: string, password: string): Promise<any> {
    console.log('JWT验证 - Step 2: 校验用户信息');
    const user = await this.usersService.findOne(username);
    if (user) {
      const hashedPassword = user.pass;
      const salt = user.pass_salt;
      // 通过密码盐，加密传参，再与数据库里的比较，判断是否相等
      const hashPassword = encryptPassword(password, salt);
      if (hashedPassword === hashPassword) {
        // 密码正确
        return {
          code: 0,
          user,
        };
      } else {
        // 密码错误
        return {
          code: 400,
          msg: `账号或密码不正确`
        };
      }
    }
    // 查无此人
    return {
      code: 400,
          msg: `查无此人`
    };
  }

  // JWT验证 - Step 3: 处理 jwt 签证
  async certificate(user: any) {
    const payload = user;
    console.log('JWT验证 - Step 3: 处理 jwt 签证');
    try {
      const token = this.jwtService.sign(payload);
      return {
        code: 0,
        data: {
          token,
        },
        msg: `登录成功`,
      };
    } catch (error) {
      return {
        code: 400,
        msg: `${error}账号或密码错误`,
      };
    }
  }
}