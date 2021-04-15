import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApparatusEntity } from './apparatus';
@Entity('service')
export class ServiceEntity {
  @PrimaryGeneratedColumn()
  service_id: number;
  @Column('varchar')
  service_name: string;
  @CreateDateColumn()
  service_add_time: string;
  @Column('int')
  service_type: number;
  @Column('int')
  service_apparatus: number;
  @Column({type:'json'})
  service_data: any;
}
