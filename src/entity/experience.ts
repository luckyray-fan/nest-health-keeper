import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
@Entity('experience')
export class ExperienceEntity {
  @PrimaryGeneratedColumn()
  experience_id: number;
  @CreateDateColumn()
  experience_add_time: string;
  @Column()
  experience_name: string;
  @Index()
  @Column()
  experience_phone: string;
}
