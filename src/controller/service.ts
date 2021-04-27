import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApparatusEntity } from 'src/entity/apparatus';
import { ReserveEntity } from 'src/entity/reserve';
import { ServiceEntity } from 'src/entity/service';
import { Public } from 'src/utils/decorator';
import { Repository } from 'typeorm';

@Controller('service')
export class ServiceController {
  constructor(
    @InjectRepository(ServiceEntity)
    private readonly repository: Repository<ServiceEntity>,
    @InjectRepository(ApparatusEntity)
    private readonly apparatusRepository: Repository<ApparatusEntity>,
    @InjectRepository(ReserveEntity)
    private readonly reserveRepository: Repository<ReserveEntity>,
  ) {}
  @Public()
  @Get('id')
  async get(@Query() query) {
    const service_id = query.service_id;
    const service = (await this.find(service_id))[0];
    const apparatus = service.service_apparatus;
    const apparatusArr = await Promise.all(
      apparatus.map(async (i) => {
        const tem = await this.apparatusRepository.find({ apparatus_id: +i });
        console.log(tem)
        return tem[0]
      }),
    );
    const reserve = await Promise.all(
      apparatus.map(async (i) => {
        const tem = await this.reserveRepository.find({ reserve_apparatus: +i });
        return tem.filter((j) => {
          const date = new Date();
          const reserveDate = new Date(j.reserve_date);
          return reserveDate.getTime()-8*60*60*1000 < date.getTime();
        }).map((j)=>{
          return {
            reserve_time: j.reserve_time,
            reserve_date: j.reserve_date
          }
        });
      }),
    );
    return {
      ...service,
      apparatusArr,
      reserve
    }
  }
  @Post('create')
  async create(@Body() body) {
    body = {
      service_name: '心理检测',
      service_apparatus: [5],
      service_data: {},
    };
    this.repository.save(body);
  }
  async find(service_id?): Promise<ServiceEntity[]> {
    let res;
    if (service_id) res = await this.repository.find({ service_id });
    else res = await this.repository.find();
    return res;
  }
}
