  import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  user: number;

  @Column('varchar')
  pass: string;
  @Column('varchar')
  pass_salt: string;
  @Column({
    default: 0,
    type: 'int'
  })
  user_type: number;

  @Column('text')
  user_data: string;
}
