export enum UserStatus {
  Active = 'active',
  Suspended = 'suspended',
}

export interface IUser {
  id: string;
  tenantId: string;
  companyId: string;
  departmentId: string;
  email: string;
  fullName: string;
  roleId: string;
  status: UserStatus;
  isDeleted: boolean;
  auth0UserId: string;
  createdAt: Date;
  updatedAt: Date;
}
