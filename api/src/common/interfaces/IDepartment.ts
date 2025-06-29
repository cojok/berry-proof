export interface IDepartment {
  id: string;
  tenantId: string;
  companyId?: string | null;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
