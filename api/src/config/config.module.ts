import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { envSchema } from './config.schema';
import { ConfigService } from './config.service';
import { LoggerModule as PinoLogger } from 'nestjs-pino/LoggerModule';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      validate: (config: Record<string, unknown>) => envSchema.parse(config),
    }),
    PinoLogger.forRootAsync({
      providers: [ConfigService],
      imports: [AppConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => cfg.loggerConfig,
    }),
    ThrottlerModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => [
        {
          ttl: cfg.apiRateLimitTimeWindow,
          limit: cfg.apiRateLimitMax,
        },
      ],
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class AppConfigModule {}
