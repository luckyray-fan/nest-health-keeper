import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
@Entity('reserve')
export class ReserveEntity {
  @PrimaryGeneratedColumn()
  reserve_id: number;
  @Column()
  reserve_user: number;
  @Column()
  reserve_record: number;
  @Column()
  reserve_cancel: number;
  @UpdateDateColumn()
  reserve_update_time: string;
  @Column()
  reserve_service: number;
  @Column()
  reserve_date: string;
  @Column('simple-array')
  reserve_time: Array<number>;
  @CreateDateColumn()
  reserve_add_time: string;
  @Index()
  @Column()
  reserve_apparatus: number;
  @Column({type:'json'})
  reserve_data: any;
}
