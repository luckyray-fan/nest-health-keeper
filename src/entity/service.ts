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
  @Column('simple-array')
  service_apparatus: Array<number>;
  @Column({type:'json'})
  service_data: any;
}
