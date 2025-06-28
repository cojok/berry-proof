import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { EnvConfig, NodeEnv } from './config.schema';
import crypto from 'crypto';
import process from 'process';
import { Params as PinoHttpParams } from 'nestjs-pino';
import { Request } from 'express';

@Injectable()
export class ConfigService {
  constructor(private readonly cs: NestConfigService<EnvConfig>) {}

  get nodeEnv(): NodeEnv {
    return this.cs.getOrThrow<NodeEnv>('NODE_ENV');
  }
  get port(): number {
    return this.cs.getOrThrow<number>('PORT');
  }

  get dbHost(): string {
    return this.cs.getOrThrow<string>('DB_HOST');
  }
  get dbPort(): number {
    return this.cs.getOrThrow<number>('DB_PORT');
  }
  get dbUser(): string {
    return this.cs.getOrThrow<string>('DB_USER');
  }
  get dbPassword(): string {
    return this.cs.getOrThrow<string>('DB_PASSWORD');
  }
  get dbName(): string {
    return this.cs.getOrThrow<string>('DB_NAME');
  }

  get logLevel(): string {
    return this.cs.getOrThrow<string>('LOG_LEVEL');
  }
  get corsOrigins(): string[] {
    return this.cs.getOrThrow<string>('CORS_ORIGINS').split(',');
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
        level: this.logLevel,
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

  get auth0Domain(): string | undefined {
    return this.cs.getOrThrow('AUTH0_DOMAIN');
  }

  get auth0Audience(): string | undefined {
    return this.cs.getOrThrow('AUTH0_AUDIENCE');
  }

  get jwtExpiration(): number {
    return this.cs.getOrThrow<number>('JWT_EXPIRATION') ?? 3600;
  }

  get jwtSecret(): string {
    const secret = this.cs.get<string>('JWT_SECRET');
    if (!secret || (secret === 'secret' && this.nodeEnv !== 'development')) {
      throw new Error('JWT_SECRET must be set to a secure value in production');
    }
    return secret;
  }

  get apiRateLimitTimeWindow(): number {
    return this.cs.getOrThrow<number>('RATE_LIMIT_TIME_WINDOW');
  }

  get apiRateLimitMax(): number {
    return this.cs.getOrThrow<number>('RATE_LIMIT_MAX');
  }
}
