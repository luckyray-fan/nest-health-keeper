import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, Request } from '@nestjs/common';

export const jwtConstants = {
  secret: 'health' // 秘钥
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  // payload, 通过验证后返回的
  async validate(payload: any, @Request() request) {
    console.log(`JWT验证 - Step 4: 被守卫调用`, payload);
    request.authInfos = payload;
    return payload;
  }
}