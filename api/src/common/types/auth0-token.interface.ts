export interface Auth0TokenPayload {
  sub: string;
  email?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string | string[];
  [key: string]: unknown;
}
