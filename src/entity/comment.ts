import { UserEntity } from 'src/user/user.entity';
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ApparatusEntity } from './apparatus';
import { SpuEntity } from './spu';
@Entity('comment')
export class CommentEntity {
  @PrimaryGeneratedColumn()
  comment_id: number;
  @Column('text')
  comment_content: string;
  @CreateDateColumn()
  comment_add_time: string;
  @UpdateDateColumn()
  comment_update_time: string;
  @Column('int')
  @ManyToOne(() => UserEntity, UserEntity => UserEntity.id)
  @Index()
  comment_owner: number;
  @ManyToOne(() => UserEntity, UserEntity=>UserEntity.id, {eager:true})
  comment_user: UserEntity;
  @Column('int')
  @ManyToOne(() => SpuEntity, SpuEntity => SpuEntity.spu_id, {eager:true})
  @Index()
  comment_spu: SpuEntity;
  @Column('int')
  comment_value: number;
  @Column('int')
  comment_order: number;
}
