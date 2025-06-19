import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { EnvConfig } from './config.schema';
import crypto from 'crypto';
import process from 'process';
import { Params as PinoHttpParams } from 'nestjs-pino';
import { Request } from 'express';

@Injectable()
export class ConfigService {
  constructor(private readonly cs: NestConfigService<EnvConfig>) {}

  get nodeEnv(): string | undefined {
    return this.cs.get('NODE_ENV');
  }
  get port(): number | undefined {
    return Number(this.cs.get('PORT'));
  }

  get dbHost(): string | undefined {
    return this.cs.get('DB_HOST');
  }
  get dbPort(): number | undefined {
    return Number(this.cs.get('DB_PORT'));
  }
  get dbUser(): string | undefined {
    return this.cs.get('DB_USER');
  }
  get dbPassword(): string | undefined {
    return this.cs.get('DB_PASSWORD');
  }
  get dbName(): string | undefined {
    return this.cs.get('DB_NAME');
  }

  get logLevel(): string | undefined {
    return this.cs.get('LOG_LEVEL');
  }
  get corsOrigins(): string[] | undefined {
    return (this.cs.get('CORS_ORIGINS') as string).split(',');
  }

  get loggerConfig(): PinoHttpParams {
    const prettyLog = {
      target: 'pino-pretty',
      options: {
        colorize: true,
        levelFirst: true,
        translateTime: 'SYS:standard',
        singleLine: true,
      },
    };

    const fileLog = {
      target: 'pino/file', // Raw JSON logs to file
      options: {
        destination: '../../logs/nestjs.log',
        mkdir: true, // Automatically create directories if they don't exist
      },
    };

    return {
      pinoHttp: {
        mixin: () => ({ traceId: crypto.randomUUID(), pid: process.pid }),
        name: 'berry-nest',
        level: this.cs.get<string>('LOG_LEVEL'),
        timestamp: () => `,"time":"${new Date().toISOString()}"`,
        redact: ['req.headers.authorization', 'password'],
        serializers: {
          req: (req: Request) => ({
            method: req.method,
            url: req.url,
            headers: req.headers,
          }),
        },
        transport: {
          targets: [prettyLog, fileLog],
        },
      },
    } as const;
  }
}
