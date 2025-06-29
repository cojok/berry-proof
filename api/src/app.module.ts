import {
  Module,
  MiddlewareConsumer,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { CustomSnakeNamingStrategy } from './common/helpers';
import { AppConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ZodValidationPipe } from './common/pipes/zod-validation/zod-validation.pipe';
import { HttpExceptionFilter } from './common/filters/http-exception/http-exception.filter';
import { TypeOrmExceptionFilter } from './common/filters/typeorm-exception/typeorm-exception.filter';
import { CorrelationIdMiddleware } from './common/middleware/correlation-id/correlation-id.middleware';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { TerminusModule, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TerminusModule,
    AppConfigModule,
    AuthModule,
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
        namingStrategy: new CustomSnakeNamingStrategy(),
        synchronize: cfg.nodeEnv === 'development',
      }),
    }),
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
