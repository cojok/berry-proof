export interface ITenant {
  id: string;
  name: string;
  subdomain: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
