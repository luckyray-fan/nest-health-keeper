import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment-es6';
import { ApparatusEntity } from 'src/entity/apparatus';
import { Public } from 'src/utils/decorator';
import { Repository } from 'typeorm';

@Controller('apparatus')
export class ApparatusController {
  constructor(
    @InjectRepository(ApparatusEntity)
    private readonly apparatusRepository: Repository<ApparatusEntity>,
  ) {}
  @Public()
  @Get('id')
  async get(@Query() query) {
    const spu_id = query.spu_id;
    return await this.find(spu_id);
  }
  @Post('create')
  async create(@Body() body) {
    body = {
      apparatus_name: '血液检查仪',
      apparatus_data: {

      },
    };
    this.apparatusRepository.save(body);
  }
  async find(apparatus_id?): Promise<ApparatusEntity[]> {
    let res;
    if (apparatus_id) res = await this.apparatusRepository.find({ apparatus_id });
    else res = await this.apparatusRepository.find();
    return res
  }
}
