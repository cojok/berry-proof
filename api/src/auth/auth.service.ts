import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verify, decode } from 'jsonwebtoken';
import jwksClient, {
  SigningKey,
  CertSigningKey,
  RsaSigningKey,
} from 'jwks-rsa';
// import { UsersService } from '@/users/users.service';
import { JwtPayload } from '../common/types/jwt-payload.interface';
// import { Auth0TokenPayload } from '../common/types/auth0-token.interface';
import { PinoLogger } from 'nestjs-pino';
import { ConfigService } from '../config/config.service';

@Injectable()
export class AuthService {
  private jwks;

  constructor(
    private readonly logger: PinoLogger,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    // private readonly usersService: UsersService,
  ) {
    this.logger.setContext(AuthService.name);
    this.jwks = jwksClient({
      jwksUri: `https://${this.config.auth0Domain}/.well-known/jwks.json`,
      cache: true,
      rateLimit: true,
    });
  }
  async loginWithAuth0Token(authHeader: string): Promise<{
    access_token: string;
    expires_in: number;
  }> {
    if (!authHeader?.startsWith('Bearer '))
      throw new UnauthorizedException('Missing or invalid token');

    const token = authHeader.replace('Bearer', '').trim();
    const decoded = decode(token, { complete: true });

    if (!decoded || typeof decoded === 'string' || !decoded.header)
      throw new UnauthorizedException('Invalid token format');

    const kid = decoded.header.kid;
    if (!kid) {
      throw new UnauthorizedException('Invalid token: missing kid');
    }
    const key = await this.getKey(kid);
    const signingKey = key.getPublicKey();

    try {
      if (!this.config.auth0Domain || !this.config.auth0Audience) {
        this.logger.error('Missing Auth0 configuration');
        throw new UnauthorizedException('Authentication configuration error');
      }

      const verifiedToken = verify(token, signingKey, {
        issuer: `https://${this.config.auth0Domain}/`,
        audience: this.config.auth0Audience,
        algorithms: ['RS256'],
      });

      if (typeof verifiedToken === 'string' || !verifiedToken) {
        throw new UnauthorizedException('Invalid token payload');
      }

      // Type guard to ensure we have the expected payload structure
      if (typeof verifiedToken === 'string' || !verifiedToken) {
        throw new UnauthorizedException('Invalid token payload');
      }

      // const verified = verifiedToken as Auth0TokenPayload;

      // Fetch or create user in Berry-Proof DB TODO use the auth0 schema
      // const user = await this.usersService.findOrCreateFromAuth0(verified);

      // const payload: JwtPayload = {
      //   sub: user.id,
      //   email: user.email,
      //   roles: user.roles,
      //   tenantId: user.tenantId,
      // };
      const payload: JwtPayload = {
        sub: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        email: 'email@qemail.com',
        tenantId: 'b9ef9e3d-c5a5-4d21-b33c-c991e6f5e2e3',
        roles: 'admin',
      };

      const accessToken = this.jwtService.sign(payload);

      return {
        access_token: accessToken,
        expires_in: this.config.jwtExpiration,
      };
    } catch (error) {
      this.logger.error('JWT verification failed', error);
      throw new UnauthorizedException('Invalid token');
    }
  }

  async getMe(user: JwtPayload): Promise<JwtPayload> {
    return Promise.resolve(user);
    // return this.usersService.findById(user.sub);
  }

  private async getKey(kid: string): Promise<CertSigningKey | RsaSigningKey> {
    return new Promise((resolve, reject) => {
      this.jwks.getSigningKey(
        kid,
        (err: Error | null, key: SigningKey | undefined) => {
          if (err) {
            reject(
              new UnauthorizedException(
                `Unable to get signing key: ${err.message}`,
              ),
            );
            return;
          }

          if (!key || typeof key.getPublicKey !== 'function') {
            reject(new UnauthorizedException('Invalid signing key structure'));
            return;
          }

          resolve(key as CertSigningKey | RsaSigningKey);
        },
      );
    });
  }
}
