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
      return this.userRepository.createQueryBuilder('user')
      .addSelect('user.pass')
      .addSelect('user.pass_salt')
      .where({user})
      .getOne();
    }
    async create(userData): Promise<UserEntity> {
      return await this.userRepository.save(userData)
    }
    async update(user:UserEntity, id): Promise<any> {
      const selectUser = await this.userRepository.findOne({id});
      console.log(selectUser, user)
      // 更新数据时，删除 id，以避免请求体内传入 id
      return await this.userRepository.save({
        ...selectUser,
        ...user
      });
    }
    async register(requestBody: any, isPassUpdate?): Promise<any> {
      const { user, pass, repass } = requestBody;
      if (!isPassUpdate && pass !== repass) {
        return {
          code: 400,
          msg: '两次密码输入不一致',
        };
      }
      const selectUser = await this.findOne(user);
      if (!isPassUpdate && selectUser) {
        return {
          code: 400,
          msg: '用户已存在',
        };
      }
      const salt = makeSalt(); // 制作密码盐
      const hashPwd = encryptPassword(pass, salt);  // 加密密码
      const finalData = { user, pass: hashPwd, pass_salt: salt };
      if(isPassUpdate){
        await this.userRepository.save({...selectUser, ...finalData});
      }else{
        await this.userRepository.save(finalData);
      }
        return {
          code: 0,
          msg: '',
        };
    }
}
