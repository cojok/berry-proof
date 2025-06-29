export interface ICompany {
  id: string;
  tenantId: string;
  name: string;
  phone?: string | null;
  address?: string | null;
  contactEmail?: string | null;
  isOwner: boolean;
  isAdminUserCreated: boolean;
  createdAt: Date;
  updatedAt: Date;
}
