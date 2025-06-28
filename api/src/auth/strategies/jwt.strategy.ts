import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../../common/types/jwt-payload.interface';
import { ConfigService } from '../../config/config.service';

@Injectable()
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export class JwtStrategy extends PassportStrategy(Strategy) {
  // @ts-ignore
  constructor(private readonly config: ConfigService) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwtSecret,
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    // Validate required fields
    if (!payload.sub || !payload.email || !payload.tenantId) {
      throw new UnauthorizedException('Invalid token payload');
    }

    // Optional: Check if user still exists and is active
    // const user = await this.userService.findById(payload.sub);
    // if (!user || !user.isActive) {
    //   throw new UnauthorizedException('User not found or inactive');
    // }

    return payload;
  }
}
