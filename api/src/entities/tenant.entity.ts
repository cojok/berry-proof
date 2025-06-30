import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ITenant, TenantStatus } from '../common/interfaces';

@Entity()
export class Tenant implements ITenant {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  @Index({ unique: true })
  name!: string;

  @Column('varchar', { nullable: true })
  @Index({ unique: true })
  subdomain!: string | null;

  @Column({ type: 'enum', enum: TenantStatus, default: TenantStatus.Active })
  status!: TenantStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
