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
  @Index()
  comment_owner: number;
  @Column('int')
  @ManyToOne(() => SpuEntity, SpuEntity => SpuEntity.spu_id)
  @Index()
  comment_spu: number;
  @Column('int')
  comment_value: number;
}
