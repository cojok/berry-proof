import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../common/entities/BaseEntity';
import { ICompany } from '../common/interfaces';

@Entity()
@Index(['tenantId', 'name'], { unique: true })
@Index('UQ_company_owner_per_tenant', ['tenantId'], {
  unique: true,
  where: '"is_owner" = true',
})
export class Company extends BaseEntity implements ICompany {
  @Column({ type: 'uuid' })
  tenantId!: string;

  @Column()
  name!: string;

  @Column('varchar', { nullable: true })
  phone?: string | null;

  @Column('varchar', { nullable: true })
  address?: string | null;

  @Column('varchar', { name: 'contact_email', nullable: true })
  contactEmail?: string | null;

  @Column('bool', { name: 'is_owner', default: false })
  isOwner = false;

  @Column('bool', { name: 'is_admin_user_created', default: false })
  isAdminUserCreated = false;
}
