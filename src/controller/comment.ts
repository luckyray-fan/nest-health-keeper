import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment-es6';
import { CommentEntity } from 'src/entity/comment';
import { Public } from 'src/utils/decorator';
import { Repository } from 'typeorm';

@Controller('comment')
export class CommentController {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly repository: Repository<CommentEntity>,
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
      comment_content: '这个产品真的其实还不错哟~',
      comment_owner: 1,
      comment_spu: 2,
      comment_value: 5
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
