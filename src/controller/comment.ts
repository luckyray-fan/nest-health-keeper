import { Body, Controller, Get, Post, Query, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment-es6';
import { CommentEntity } from 'src/entity/comment';
import { RecordEntity } from 'src/entity/record';
import { Public } from 'src/utils/decorator';
import { Repository } from 'typeorm';

@Controller('comment')
export class CommentController {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly repository: Repository<CommentEntity>,
    @InjectRepository(RecordEntity)
    private readonly recordRepository: Repository<RecordEntity>
  ) {}
  @Public()
  @Get('id')
  async get(@Query() query) {
    const spu_id = query.spu_id;
    return await this.find(spu_id);
  }
  @Post('/')
  async comment(@Body() body, @Request() request) {
    const res = {
      comment_content: body.comment,
      comment_owner: request.user.id,
      comment_user: request.user.id,
      comment_spu: body.spu.spu_id,
      comment_value: body.rate,
    };
    const tem = await this.repository.save(res);
    const record = await this.recordRepository.findOne({record_id: body.record_id});
    record.record_comment = tem.comment_id
    this.recordRepository.save(record);
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
  async find(comment_id?): Promise<CommentEntity[]> {
    let res;
    if (comment_id) res = await this.repository.find({ comment_id });
    else res = await this.repository.find();
    return res
  }
}
