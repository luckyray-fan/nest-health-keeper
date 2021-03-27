import { Response } from "express";
import { Logger } from "src/utils/log4js";

export function LoggerMiddleware (req: any, res: Response, next: () => void){
  var oldWrite = res.write,
      oldEnd = res.end;
  var body = ''
  var chunks = [];

  res.write = function (chunk) {
    chunks.push(chunk);

    return oldWrite.apply(res, arguments);
  };

  res.end = function (chunk) {
    if (chunk)
      chunks.push(chunk);

    body = Buffer.concat(chunks).toString('utf8');
    oldEnd.apply(res, arguments);
  };
  next();
  res.on('finish', ()=>{
    const code = res.statusCode; // 响应状态码
    // 组装日志信息
    const logFormat =
    `Request original url: ${req.originalUrl}
Method: ${req.method}
IP: ${req.ip}
Status code: ${code}
Parmas: ${JSON.stringify(req.params)}
Query: ${JSON.stringify(req.query)}
Body: ${JSON.stringify(req.body)}
Response: ${body}`;
     // 根据状态码，进行日志类型区分
     if (code >= 500) {
      Logger.error(logFormat);
    } else if (code >= 400) {
      Logger.warn(logFormat);
    } else {
      Logger.log(logFormat);
    }
  })
}
