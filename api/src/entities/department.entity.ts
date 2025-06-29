import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../common/entities/BaseEntity';
import { IDepartment } from '../common/interfaces';

@Entity()
export class Department extends BaseEntity implements IDepartment {
  @Column()
  name!: string;
}
