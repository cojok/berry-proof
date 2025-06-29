import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from '../common/entities/BaseEntity';
import { IUser, IRole } from '../common/interfaces';
import { Role } from './role.entity';

@Entity()
export class User extends BaseEntity implements IUser {
  @Column({ unique: true })
  email!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @ManyToMany(() => Role)
  @JoinTable({ name: 'user_roles' })
  roles?: IRole[];
}
