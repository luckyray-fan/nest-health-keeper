import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApparatusEntity } from 'src/entity/apparatus';
import { ServiceEntity } from 'src/entity/service';
import { Public } from 'src/utils/decorator';
import { Repository } from 'typeorm';

@Controller('apparatus')
export class ApparatusController {
  constructor(
    @InjectRepository(ApparatusEntity)
    private readonly repository: Repository<ApparatusEntity>,
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
      apparatus_name: '心理检测',
      apparatus_type: 2,
      apparatus_time: '[[8,9],[9,10],[10,11],[10,12],[14,15],[15,16]]',
      apparatus_data: {}
    };
    this.repository.save(body);
  }
  async find(apparatus_id?): Promise<ApparatusEntity[]> {
    let res;
    if (apparatus_id) res = await this.repository.find({ apparatus_id });
    else res = await this.repository.find();
    return res
  }
}
