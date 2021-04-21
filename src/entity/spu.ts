import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CommentEntity } from './comment';
@Entity('spu')
export class SpuEntity {
  @PrimaryGeneratedColumn()
  spu_id: number;
  @Column('varchar')
  spu_name: string;
  @Column('varchar')
  spu_pic: string;
  @CreateDateColumn()
  spu_add_time: string;
  @Column('int')
  spu_type: number;
  @Column('varchar')
  spu_price: string;
  @Column({type:'json'})
  spu_data: any;
  @OneToMany(type => CommentEntity, CommentEntity => CommentEntity.comment_spu)
  comments: CommentEntity[];
}
