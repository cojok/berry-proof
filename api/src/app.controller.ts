import { Controller, Get } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { PinoLogger } from 'nestjs-pino';

@Controller()
export class AppController {
  constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly typeOrm: TypeOrmHealthIndicator,
    private readonly diskCheck: DiskHealthIndicator,
    private readonly memoryIndicator: MemoryHealthIndicator,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(AppController.name);
  }

  @Get()
  @HealthCheck()
  async checkHealth(): Promise<HealthCheckResult> {
    return this.healthCheckService.check([
      async () =>
        this.diskCheck.checkStorage('disk', {
          path: '/',
          thresholdPercent: 0.9,
        }),
      async () =>
        this.memoryIndicator.checkRSS('memory_rss', 500 * 1024 * 1024), // 500MB
      async () => this.typeOrm.pingCheck('postgresql'),
      async () =>
        this.memoryIndicator.checkHeap('memory_heap', 150 * 1024 * 1024),
    ]);
  }
}
