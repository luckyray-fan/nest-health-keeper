import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable, Request } from '@nestjs/common';

import { ReserveEntity } from 'src/entity/reserve';
import { Public } from 'src/utils/decorator';
import { Repository } from 'typeorm';
import { ServiceEntity } from 'src/entity/service';
import { RecordEntity } from 'src/entity/record';

@Controller('reserve')
export class ReserveController {
  constructor(
    @InjectRepository(ReserveEntity)
    private readonly repository: Repository<ReserveEntity>,
    @InjectRepository(ServiceEntity)
    private readonly serviceRepository: Repository<ServiceEntity>,
    @InjectRepository(RecordEntity)
    private readonly recordRepository: Repository<RecordEntity>
  ) {}
  @Public()
  @Get('id')
  async get(@Query() query) {
    const id = query.service_id;
    return await this.find(id);
  }
  @Get('list')
  async list(@Request() request) {
    const reserve_user = request.user.id;
    const reserveList = (await this.repository.find({reserve_user}))
    const serviceObj = {};
    await Promise.all(reserveList.map(async (i)=>{
      if(!serviceObj[i.reserve_service]){
        serviceObj[i.reserve_service] = await this.serviceRepository.findOne({service_id: i.reserve_service})
      }
    }))
    return reserveList.map(i=>{
      const tem = {} as any;
      tem.service = serviceObj[i.reserve_service];
      return {
        ...i,
        ...tem
      }
    })
  }
  @Post('/')
  async reserve(@Body() body, @Request() request) {
    const res = {
      ...body,
      reserve_user: request.user.id,
    };
    const record = await this.recordRepository.findOne({record_id: body.reserve_record});
    record.service_status[body.reserve_service].status = 1;
    await this.recordRepository.save(record);
    this.repository.save(res);
  }
  @Post('/cancel')
  async cancel(@Body() body, @Request() request) {
    const record = await this.recordRepository.findOne({record_id: body.reserve_record});
    record.service_status[body.reserve_service].status = 0;
    await this.recordRepository.save(record);
    const res = await this.repository.findOne({reserve_id: body.reserve_id});
    res.reserve_cancel = 1;
    this.repository.save(res);
  }
  @Post('create')
  async create(@Body() body) {
    body = {
      comment_content: '真的可以捏~',
      comment_owner: 1,
      comment_spu: 2,
      comment_value: 4,
    };
    this.repository.save(body);
  }
  async find(reserve_id?): Promise<ReserveEntity[]> {
    let res;
    if (reserve_id) res = await this.repository.find({ reserve_id });
    else res = await this.repository.find();
    return res
  }
}
