import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable, Request } from '@nestjs/common';

import { ReserveEntity } from 'src/entity/reserve';
import { Public } from 'src/utils/decorator';
import { Repository } from 'typeorm';
import { RecordEntity } from 'src/entity/record';
import { SpuEntity } from 'src/entity/spu';
import { OrderEntity } from 'src/entity/order';
import { ServiceEntity } from 'src/entity/service';

@Controller('record')
export class RecordController {
  constructor(
    @InjectRepository(RecordEntity)
    private readonly repository: Repository<RecordEntity>,
    @InjectRepository(ServiceEntity)
    private readonly serviceRepository: Repository<ServiceEntity>,
    @InjectRepository(SpuEntity)
    private readonly spuRepository: Repository<SpuEntity>,
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
  ) {}
  @Public()
  @Get('id')
  async get(@Query() query) {
    const id = query.service_id;
    return await this.find(id);
  }
  @Get('list')
  async list(@Request() request) {
    const record = await this.repository.find({ record_user: request.user.id });
    const spuObj = {};
    const orderObj = {};
    const serviceObj = {};
    await Promise.all(
      record.map(async (i) => {
        if (!spuObj[i.record_spu]) {
          spuObj[i.record_spu] = await this.spuRepository.findOne({
            spu_id: i.record_spu,
          });
        }
        if (!orderObj[i.record_order]) {
          orderObj[i.record_order] = await this.orderRepository.findOne({
            order_id: i.record_order,
          });
        }
        await Promise.all( Object.keys(i.service_status).map(async (j)=>{
          if (!serviceObj[j]) {
            serviceObj[j] = await this.serviceRepository.findOne({
              service_id: +j,
            });
          }
        }))

      }),
    );
    const recordRes = record.map(i=>{
      const tem  = {} as any;
      tem.spu = spuObj[i.record_spu];
      tem.order = orderObj[i.record_order];
      Object.keys(i.service_status).map(j=>{
        i.service_status[j] = {
          ...i.service_status[j],
          ...serviceObj[j]
        }
      })
      return {...i,...tem};
    })
    return recordRes;
  }
  @Post('/')
  async reserve(@Body() body, @Request() request) {
    const res = {
      ...body,
      reserve_user: request.user.id,
    };
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
  async find(record_id?): Promise<RecordEntity[]> {
    let res;
    if (record_id) res = await this.repository.find({ record_id });
    else res = await this.repository.find();
    return res;
  }
}
