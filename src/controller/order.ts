import { Body, Controller, Get, Post, Query, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SERVICE_STATUS, TRANSACTION_TYPE } from 'src/common/constant';
import { OrderEntity } from 'src/entity/order';
import { RecordEntity } from 'src/entity/record';
import { ServiceEntity } from 'src/entity/service';
import { TransactionEntity } from 'src/entity/transaction';
import { Public } from 'src/utils/decorator';
import { Repository } from 'typeorm';

@Controller('order')
export class OrderController {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly repository: Repository<OrderEntity>,
    @InjectRepository(RecordEntity)
    private readonly recordRepository: Repository<RecordEntity>,
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
    @InjectRepository(ServiceEntity)
    private readonly serviceRepository: Repository<ServiceEntity>,
  ) {}
  @Get('user')
  async get(@Request() request) {
    const order_user = request.user.id;
    return await this.repository.find({order_user})
  }
  @Post('/pay')
  async pay(@Body() body, @Request() request) {
    body.order_status = 2;
    const order = (await this.find(body.order_id))[0];
    const tem = [];
    const transaction_data = {
      transaction_order: order.order_id,
      transaction_type: TRANSACTION_TYPE.WEIXIN,
      transaction_user: request.user.id,
      transaction_price: order.order_price,
      transaction_pay_money: order.order_price,
      transaction_pay_credit: 0, //之后写积分支付的时候再来看看这边
      transaction_data: {}
    }
    await this.transactionRepository.save(transaction_data);
    order.order_data.spuList.forEach(i=>{
      [...Array(i.num)].map(j=>{
        const service_status = {};
        i.spu_service.map(x=>{
          service_status[x] = {
            status: SERVICE_STATUS.not_reserve
          };
        })
        const temObj = {
          record_order: body.order_id,
          record_user: request.user.id,
          record_spu: i.spu_id,
          service_status,
          record_data: {}
        };
        tem.push(temObj)
      })
    })
    await this.recordRepository.save(tem);
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
