import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../common/entities/BaseEntity';
import { ICompany } from '../common/interfaces';

@Entity()
export class Company extends BaseEntity implements ICompany {
  @Column()
  name!: string;
}
