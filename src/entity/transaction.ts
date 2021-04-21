import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApparatusEntity } from './apparatus';
@Entity('transaction')
export class TransactionEntity {
  @PrimaryGeneratedColumn()
  transaction_id: number;
  @CreateDateColumn()
  transaction_add_time: string;
  @Index()
  @Column()
  transaction_user: number;
  @Index()
  @Column()
  transaction_order: number;
  @Column()
  transaction_type: number;
  @Column()
  transaction_price: number;
  @Column()
  transaction_pay_money:number;
  @Column()
  transaction_pay_credit:number;
  @Column({ type: 'json' })
  transaction_data: any;
}
