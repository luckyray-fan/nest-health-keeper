import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpStatus } from "@nestjs/common";
import { Response } from "express";
import { Observable } from "rxjs";

@Injectable()
export class PostInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): any {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    if (request.method === 'POST') response.status(HttpStatus.OK)
    return next.handle()
  }
}