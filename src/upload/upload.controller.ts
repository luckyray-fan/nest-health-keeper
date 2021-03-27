import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Logger } from 'src/utils/log4js';
import { Readable } from 'stream';
const qiniu = require('qiniu');

@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file) {
    console.log(file);
    const bucket = 'luckyray';
    const accessKey = 'yEKw8JAHSZ34G7FOXCbHqt1rZ_gqLpW8y9vIhSwI';
    const secretKey = '4_drYCmJqTAqsaUh0bEyZPZxhd4cyErzTgAIaP5b';
    const domain = 'http://img.luckyray.cn/';
    const zone =  (qiniu) => qiniu.zone.Zone_z2;
  var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
  var options = {
    scope: bucket,
  };
  var putPolicy = new qiniu.rs.PutPolicy(options);
  var uploadToken = putPolicy.uploadToken(mac);

  var Qconfig = new qiniu.conf.Config();
  // 空间对应的机房
  Qconfig.zone = zone(qiniu);
  var formUploader = new qiniu.form_up.FormUploader(Qconfig);
  var putExtra = new qiniu.form_up.PutExtra();
  const fileName = file.originalname
  var key = file.originalname;
  const readStream = new Readable({
    read() {
      this.push(file.buffer);
      this.push(null);
    }
  });
  // 文件上传
  return await new Promise(res=>{
    formUploader.putStream(uploadToken, key, readStream, putExtra, async function (
      respErr,
      respBody,
      respInfo
    ) {
      if (respErr) {
        throw respErr;
      }
      if (respInfo.statusCode == 200) {
        var uploadUrl = domain + fileName;
        Logger.info(`成功上传文件至七牛云\n${uploadUrl}`);
        res(uploadUrl)
      } else {
        Logger.error('上传出错',respErr);
      }
    });
  })
  }
}
