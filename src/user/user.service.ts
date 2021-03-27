import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {UserEntity} from './user.entity'

import { makeSalt, encryptPassword } from '../utils/cryptogram';

@Injectable()
export class UserService {
	constructor(
	    @InjectRepository(UserEntity)
	    private readonly userRepository: Repository<UserEntity>,
	  ) { }
    async findAll(): Promise<UserEntity[]> {
      return this.userRepository.find();
    }
    async findOne(user): Promise<UserEntity> {
      return this.userRepository.findOne({user});
    }
    async create(userData): Promise<UserEntity> {
      return await this.userRepository.save(userData)
    }
    async update(user:UserEntity): Promise<void> {
      const selectUser = await this.findOne({user:user.user});
      // 更新数据时，删除 id，以避免请求体内传入 id
      this.userRepository.save({
        ...selectUser,
        ...user
      });
    }
    async register(requestBody: any): Promise<any> {
      const { user, pass, repass } = requestBody;
      if (pass !== repass) {
        return {
          code: 400,
          msg: '两次密码输入不一致',
        };
      }
      const selectUser = await this.findOne(user);
      if (selectUser) {
        return {
          code: 400,
          msg: '用户已存在',
        };
      }
      const salt = makeSalt(); // 制作密码盐
      const hashPwd = encryptPassword(pass, salt);  // 加密密码
      const finalData = { user, pass: hashPwd, pass_salt: salt };
        await this.userRepository.save(finalData);
        return {
          code: 0,
          msg: '',
        };
    }
}
