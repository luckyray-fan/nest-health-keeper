import { Body, Controller, Get, Post, Query, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from 'src/entity/order';
import { Public } from 'src/utils/decorator';
import { Repository } from 'typeorm';

@Controller('order')
export class OrderController {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly repository: Repository<OrderEntity>,
  ) {}
  @Get('user')
  async get(@Request() request) {
    const order_user = request.user.id;
    return await this.repository.find({order_user})
  }
  @Post('/pay')
  async pay(@Body() body, @Request() request) {
    body.order_status = 2;
    return this.repository.save(body);
  }
  @Post('/')
  async order(@Body() body, @Request() request) {
    body.order_status = 1;
    body.order_user = request.user.id
    this.repository.save(body);
  }
  @Post('create')
  async create(@Body() body) {
    body = {
      apparatus_name: '血液检查仪',
      apparatus_type: 1,
      apparatus_time: '[[8,9],[9,10],[10,11],[10,12],[14,15],[15,16]]',
      apparatus_data: {}
    };
    this.repository.save(body);
  }
  async find(order_id?): Promise<OrderEntity[]> {
    let res;
    if (order_id) res = await this.repository.find({ order_id });
    else res = await this.repository.find();
    return res
  }
}
