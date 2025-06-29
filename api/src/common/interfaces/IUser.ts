import { IRole } from './IRole';

export interface IUser {
  id: string;
  tenantId: string;
  companyId?: string | null;
  email: string;
  firstName: string;
  lastName: string;
  roles?: IRole[];
  createdAt: Date;
  updatedAt: Date;
}
