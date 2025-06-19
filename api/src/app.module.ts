import {
  Module,
  MiddlewareConsumer,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { LoggerModule as PinoLogger } from 'nestjs-pino';
import { LoggerModule } from './common/logger/logger.module';
import { ZodValidationPipe } from './common/pipes/zod-validation/zod-validation.pipe';
import { HttpExceptionFilter } from './common/filters/http-exception/http-exception.filter';
import { TypeOrmExceptionFilter } from './common/filters/typeorm-exception/typeorm-exception.filter';
import { CorrelationIdMiddleware } from './common/middleware/correlation-id/correlation-id.middleware';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { TerminusModule, TypeOrmHealthIndicator } from '@nestjs/terminus';

@Module({
  imports: [
    TerminusModule,
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService): TypeOrmModuleOptions => ({
        type: 'postgres',
        host: cfg.dbHost,
        port: cfg.dbPort,
        username: cfg.dbUser,
        password: cfg.dbPassword,
        database: cfg.dbName,
        entities: [__dirname + '/**/*.entity.{ts,js}'],
        synchronize: cfg.nodeEnv === 'development',
      }),
    }),
    PinoLogger.forRootAsync({
      imports: [AppConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => cfg.loggerConfig,
    }),
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_PIPE, useClass: ZodValidationPipe },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_FILTER, useClass: TypeOrmExceptionFilter },
    AppService,
    TypeOrmHealthIndicator,
  ],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CorrelationIdMiddleware).forRoutes({
      path: '/*path',
      method: RequestMethod.ALL,
    });
  }
}
