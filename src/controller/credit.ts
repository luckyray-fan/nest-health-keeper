import { Body, Controller, Get, Post, Query, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApparatusEntity } from 'src/entity/apparatus';
import { CreditEntity } from 'src/entity/credit';
import { ServiceEntity } from 'src/entity/service';
import { SpuEntity } from 'src/entity/spu';
import { Public } from 'src/utils/decorator';
import { Repository } from 'typeorm';

@Controller('credit')
export class CreditController {
  constructor(
    @InjectRepository(CreditEntity)
    private readonly repository: Repository<CreditEntity>,
    @InjectRepository(SpuEntity)
    private readonly spuRepository: Repository<SpuEntity>,
  ) {}
  @Get('sum')
  async sum(@Request() request) {
    const credit =  this.repository.find({credit_user: request.user.id});
    let sum = 0;
    (await credit).map(i=>{
      if(i.credit_order){
        sum -= i.credit_num
      }else if(i.credit_spu){
        sum+=i.credit_num;
      }
    })
    return sum;
  }
  @Get('list')
  async get(@Request() request) {
    const credit = await this.repository.find({credit_user: request.user.id})
    const spuObj = {};
    await Promise.all(credit.map(async(i)=>{
      if(!spuObj[i.credit_spu]){
        spuObj[i.credit_spu] = await this.spuRepository.findOne({spu_id: i.credit_spu});
      }
    }))
    return credit.map(i=>{
      return {
        ...i,
        spu: spuObj[i.credit_spu]
      }
    })
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
  async find(credit_id?): Promise<ApparatusEntity[]> {
    let res;
    if (credit_id) res = await this.repository.find({ credit_id });
    else res = await this.repository.find();
    return res
  }
}
