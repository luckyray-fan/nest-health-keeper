import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
@Entity('order')
export class OrderEntity {
  @PrimaryGeneratedColumn()
  order_id: number;
  @CreateDateColumn()
  order_add_time: string;
  @Index()
  @Column()
  order_user: number;
  @Column()
  order_price: number;
  @Column()
  order_status: number;
  @Column()
  order_usecredit: number;
  @Column({type:'json'})
  order_data: any;
}
