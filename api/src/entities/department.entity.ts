import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../common/entities/BaseEntity';
import { IDepartment } from '../common/interfaces';

@Entity()
@Index(['companyId', 'name'], { unique: true })
export class Department extends BaseEntity implements IDepartment {
  @Column({ type: 'uuid' })
  companyId!: string;

  @Column()
  name!: string;
}
