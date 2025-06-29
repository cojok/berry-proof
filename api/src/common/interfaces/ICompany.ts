export interface ICompany {
  id: string;
  tenantId: string;
  companyId?: string | null;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
