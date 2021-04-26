import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
@Entity('credit')
export class CreditEntity {
  @PrimaryGeneratedColumn()
  credit_id: number;
  @Column()
  credit_spu: number;
  @Column()
  credit_order: number;
  @Column()
  credit_num: number;
  @Index()
  @Column()
  credit_user: number;
  @CreateDateColumn()
  credit_add_time: string;
  @Column({type:'json'})
  credit_data: any;
}
