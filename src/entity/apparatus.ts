import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('apparatus')
export class ApparatusEntity {
  @PrimaryGeneratedColumn()
  apparatus_id: number;
  @Column('varchar')
  apparatus_name: string;
  @Column()
  apparatus_type: number;
  @CreateDateColumn()
  apparatus_add_time: string;
  @Column('text')
  apparatus_time: string;
  @Column({type:'json'})
  apparatus_data: any;
}
