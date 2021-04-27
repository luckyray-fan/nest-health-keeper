import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment-es6';
import { CommentEntity } from 'src/entity/comment';
import { ServiceEntity } from 'src/entity/service';
import { SpuEntity } from 'src/entity/spu';
import { Public } from 'src/utils/decorator';
import { In, Repository } from 'typeorm';

@Controller('spu')
export class SpuController {
  constructor(
    @InjectRepository(SpuEntity)
    private readonly spuRepository: Repository<SpuEntity>,
    @InjectRepository(ServiceEntity)
    private readonly serviceRepository: Repository<ServiceEntity>,
  ) {}

  @Public()
  @Get('list')
  async list() {
    return await this.find();
  }
  @Get('ids')
  async getIds(@Query() query) {
    const spuIdList = query.spuIdList;

    return await this.spuRepository.find({
      where: { spu_id: In(spuIdList) },
    });
  }
  @Public()
  @Get('id')
  async get(@Query() query) {
    const spu_id = query.spu_id;
    if (query.get_comment) {
      const tem = await this.spuRepository.find({
        relations: ['comments'],
        where: { spu_id },
      });
      const serviceObj = {};
      await Promise.all(
        tem.map(async (i) => {
          await Promise.all(
            i.spu_service.map(async (j) => {
              if (!serviceObj[j]) {
                serviceObj[j] = await this.serviceRepository.findOne({
                  service_id: j,
                });
              }
            }),
          );
        }),
      );
      const resArr = [];
      tem.map((i) => {
        const temService = i.spu_service.map((j, idx) => {
          return {
            [j]: serviceObj[j],
          };
        });
        resArr.push({
          ...i,
          spu_service: temService,
        });
      });
      return resArr;
    }
    return await this.find(spu_id);
  }
  @Post('create')
  async create(@Body() body) {
    body = {
      spu_name: '心理测试',
      spu_pic: 'http://img.luckyray.cn/images.png',
      spu_type: 2,
      spu_price: 400,
      spu_credit: 100,
      spu_service: [5],
      spu_data: {
        spu_desc: {
          pic: 'http://img.luckyray.cn/FrybaOnQrMI-Pn5Q4AwV6O2DHiAs.png',
          desc: '心理测试, 看看你的人格偏向',
        },
        other_pics: [],
      },
    };
    this.spuRepository.save(body);
  }
  async find(spu_id?): Promise<SpuEntity[]> {
    let res;
    if (spu_id) res = await this.spuRepository.find({ spu_id });
    else res = await this.spuRepository.find();
    return res.map((i) => {
      i.spu_add_time = moment(i.spu_add_time).format('yyyy-MM-DD');
      return i;
    });
  }
}
