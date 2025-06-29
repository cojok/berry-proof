export enum TenantStatus {
  Active = 'active',
  Suspended = 'suspended',
}

export interface ITenant {
  id: string;
  name: string;
  subdomain?: string | null;
  status: TenantStatus;
  createdAt: Date;
  updatedAt: Date;
}
