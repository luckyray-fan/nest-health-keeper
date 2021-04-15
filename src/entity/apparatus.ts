import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('apparatus')
export class ApparatusEntity {
  @PrimaryGeneratedColumn()
  apparatus_id: number;
  @Column('varchar')
  apparatus_name: string;
  @Column({type:'json'})
  apparatus_data: any;
}
