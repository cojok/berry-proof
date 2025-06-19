import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(_req: unknown, _res: unknown, next: () => void) {
    next();
  }
}
