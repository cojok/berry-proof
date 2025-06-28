export interface JwtPayload {
  sub: string;
  email: string;
  tenantId: string;
  roles: string;
  iat?: number;
  exp?: number;
}
