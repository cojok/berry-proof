import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { ZodValidationPipe } from './common/pipes/zod-validation/zod-validation.pipe';
import { HttpExceptionFilter } from './common/filters/http-exception/http-exception.filter';
import { TypeOrmExceptionFilter } from './common/filters/typeorm-exception/typeorm-exception.filter';
import { VersioningType } from '@nestjs/common';
import { ZodExceptionFilter } from './common/filters/zod-exception/zod-exception.filter';
import { Logger } from 'nestjs-pino';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(Logger));

  // Enable CORS based on config
  const configService = app.get(ConfigService);
  console.log(configService.corsOrigins);
  // app.enableCors({ origin: configService.corsOrigins });
  app.enableCors({ origin: '*' });

  // Global Zod validation
  app.useGlobalPipes(new ZodValidationPipe());

  // Global exception filters
  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new TypeOrmExceptionFilter(),
    new ZodExceptionFilter(),
  );

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'v',
  });

  // Start listening
  await app.listen(configService.port as unknown as string);
}

bootstrap().catch((err: Error) => {
  throw err;
});
