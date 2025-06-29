import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../common/entities/BaseEntity';
import { IRole } from '../common/interfaces';

@Entity()
export class Role extends BaseEntity implements IRole {
  @Column({ unique: true })
  name!: string;
}
