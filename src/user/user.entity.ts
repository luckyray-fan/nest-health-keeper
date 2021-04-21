  import { CommentEntity } from 'src/entity/comment';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  user: number;

  @Column('varchar', { select: false })
  pass: string;
  @Column('varchar', { select: false })
  pass_salt: string;
  @Column({
    default: 0,
    type: 'int'
  })
  user_type: number;

  @Column('json')
  user_data: string;
  @OneToMany(type => CommentEntity, CommentEntity => CommentEntity.comment_spu)
  comments: CommentEntity[]
}
