import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('tb_health')
export class HealthEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'idtb_health' })
  idHealth: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idtb_users' })
  user: UserEntity;

  @Column({ name: 'idtb_users', type: 'uuid' })
  idUsers: string;

  @Column({ name: 'height_cm', type: 'decimal', precision: 5, scale: 2 })
  heightCm: number;

  @Column({ name: 'weight_kg', type: 'decimal', precision: 5, scale: 2 })
  weightKg: number;

  @Column({ name: 'bmi', type: 'decimal', precision: 5, scale: 2 })
  bmi: number;

  @Column({ name: 'bmi_status', length: 50 })
  bmiStatus: string;

  @Column({ name: 'observation', type: 'text', nullable: true })
  observation?: string;

  @Column({ name: 'measurement_date', type: 'timestamp' })
  measurementDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}