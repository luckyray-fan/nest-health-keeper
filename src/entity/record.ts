import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
@Entity('record')
export class RecordEntity {
  @PrimaryGeneratedColumn()
  record_id: number;
  @Index()
  @Column()
  record_user: number;
  @Column()
  record_spu: number;
  @Column()
  record_order: number;
  @Column({type:'json'})
  record_data: any;
}
