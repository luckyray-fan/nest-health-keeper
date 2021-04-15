import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ResultInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data?.code !== undefined) {
          return data;
        } else {
          return {
            data,
            code: 0,
            msg: '',
          };
        }
      }),
    );
  }
}

// 定义通用的API接口返回数据类型
export interface Result {
  code: number;
  message: string;
  data?: any;
}
