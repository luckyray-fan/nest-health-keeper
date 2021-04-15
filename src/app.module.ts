import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt.guard';
import { jwtConstants, JwtStrategy } from './auth/jwt.strategy';
import { ErrorsInterceptor } from './common/errors.interceptor';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { UserController } from './user/user.controller';
import { UserEntity } from './user/user.entity';
import { UserService } from './user/user.service';
import { UploadController } from './upload/upload.controller';
import { PostInterceptor } from './common/post.interceptor';
import {SpuEntity} from './entity/spu';
import { SpuController } from './controller/spu';
import { ResultInterceptor } from './common/result.interceptor';
import { ApparatusEntity } from './entity/apparatus';
import { CommentEntity } from './entity/comment';
import { CommentController } from './controller/comment';
import { ApparatusController } from './controller/apparatus';

// https://stackoverflow.com/a/61119284/9950564
// https://juejin.cn/post/6857391336929263624#heading-12 一个用nodemon全程ts使用, 一个改写orm config读取的路径
@Module({
  imports: [
    // mysql的连接
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([UserEntity, SpuEntity, ApparatusEntity, CommentEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '80d' }, // token 过期时效
    }),
  ],
  controllers: [AppController, UserController, UploadController, SpuController, ApparatusController, CommentController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorsInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: PostInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResultInterceptor,
    },
    AppService,
    UserService,
    AuthService,
    JwtStrategy,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 非全局
    // consumer
    //   .apply(LoggerMiddleware)
  }
}