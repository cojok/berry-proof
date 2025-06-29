import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../common/entities/BaseEntity';
import { IUser, UserStatus } from '../common/interfaces';

@Entity()
@Index('UQ_user_email', ['email'], { unique: true })
export class User extends BaseEntity implements IUser {
  @Column({ type: 'uuid' })
  tenantId!: string;

  @Column({ type: 'uuid' })
  companyId!: string;

  @Column({ type: 'uuid' })
  departmentId!: string;

  @Column()
  email!: string;

  @Column({ name: 'full_name' })
  fullName!: string;

  @Column({ type: 'uuid', name: 'role_id' })
  roleId!: string;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.Active })
  status!: UserStatus;

  @Column({ name: 'is_deleted', default: false })
  isDeleted = false;

  @Column({ name: 'auth0_user_id' })
  auth0UserId!: string;
}
