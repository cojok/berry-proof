import { Controller, Get, Post, Headers, UseGuards, Req } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtPayload } from '../common/types/jwt-payload.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly logger: PinoLogger,
    private readonly authService: AuthService,
  ) {
    this.logger.setContext(AuthController.name);
  }

  @Post('/login')
  async login(
    @Headers('Authorization') authHeader: string,
  ): Promise<{ access_token: string; expires_in: number }> {
    return this.authService.loginWithAuth0Token(authHeader);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async me(@Req() req: JwtPayload): Promise<JwtPayload> {
    return this.authService.getMe(req);
  }
}
