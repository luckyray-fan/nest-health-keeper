import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment-es6';
import { CommentEntity } from 'src/entity/comment';
import { SpuEntity } from 'src/entity/spu';
import { Public } from 'src/utils/decorator';
import { In, Repository } from 'typeorm';

@Controller('spu')
export class SpuController {
  constructor(
    @InjectRepository(SpuEntity)
    private readonly spuRepository: Repository<SpuEntity>,
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
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
      return (
        await this.spuRepository.find({ relations: ["comments"] }))
    }
    return await this.find(spu_id);
  }
  @Post('create')
  async create(@Body() body) {
    body = {
      spu_name: '体能康复套餐',
      spu_pic:
        'https://img13.360buyimg.com/n7/jfs/t1/27652/18/12464/928612/5c985ce1Eaa45fcdb/1fb4aa796250c8b6.png',
      spu_type: 2,
      spu_price: 2000,
      spu_data: {
        spu_desc: {
          pic: 'http://img.luckyray.cn/health_spu_desc.jpg',
          desc: '体能康复, 包含了多种服务',
        },
        other_pics: [
          'https://img10.360buyimg.com/imgzone/jfs/t1/23825/20/12489/886305/5c985e33E97fa86fa/51ab6809017e21ca.png',
        ],
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
