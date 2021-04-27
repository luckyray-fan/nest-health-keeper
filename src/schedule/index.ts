import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
 import { Cron, Interval, Timeout, NestSchedule } from 'nest-schedule';
import { SERVICE_STATUS } from 'src/common/constant';
import { RecordEntity } from 'src/entity/record';
import { ReserveEntity } from 'src/entity/reserve';
import { Repository } from 'typeorm';

 @Injectable() // Only support SINGLETON scope
 export class ScheduleService extends NestSchedule {
  constructor(
    @InjectRepository(ReserveEntity)
    private readonly repository: Repository<ReserveEntity>,
    @InjectRepository(RecordEntity)
    private readonly recordRepository: Repository<RecordEntity>,
  ) {
    super();
  }
  //每小时将已经预约过期的置为 已完成
   @Cron('0 * * * *')
   async cronJob() {
     const reserve = (await this.repository.find()).filter(i=>{
       const tem = i.reserve_date+' '+i.reserve_time[0]+':00';
       if(new Date(tem)<new Date()){
         return true;
       }
     });
     await Promise.all(reserve.map(async(i)=>{
       const record = await this.recordRepository.findOne({record_id: i.reserve_record});
       record.service_status[i.reserve_service] = SERVICE_STATUS.reserved;
     }))
   }
  }