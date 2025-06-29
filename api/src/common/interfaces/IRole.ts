export interface IRole {
  id: string;
  tenantId: string;
  companyId?: string | null;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
