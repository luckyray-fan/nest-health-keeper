import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable, Request } from '@nestjs/common';

import { ReserveEntity } from 'src/entity/reserve';
import { Public } from 'src/utils/decorator';
import { Repository } from 'typeorm';

@Controller('reserve')
export class ReserveController {
  constructor(
    @InjectRepository(ReserveEntity)
    private readonly repository: Repository<ReserveEntity>,
    @InjectRepository(ReserveEntity)
    private readonly serviceRepository: Repository<ReserveEntity>,
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
    const reserveList = await this.repository.find({reserve_user});
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
  async find(reserve_id?): Promise<ReserveEntity[]> {
    let res;
    if (reserve_id) res = await this.repository.find({ reserve_id });
    else res = await this.repository.find();
    return res
  }
}
