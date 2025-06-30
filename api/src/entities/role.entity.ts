import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../common/entities/BaseEntity';
import { IRole } from '../common/interfaces';

@Entity()
@Index(['tenantId', 'name'], { unique: true })
export class Role extends BaseEntity implements IRole {
  @Column({ type: 'uuid' })
  tenantId!: string;

  @Column()
  name!: string;

  @Column('varchar', { nullable: true })
  description!: string | null;

  @Column('jsonb', { nullable: true })
  permissions!: unknown;

  @Column('bool', { name: 'is_system_role', default: false })
  isSystemRole = false;
}
