export interface IRole {
  id: string;
  tenantId: string;
  name: string;
  description?: string | null;
  permissions?: unknown;
  isSystemRole: boolean;
  createdAt: Date;
  updatedAt: Date;
}
