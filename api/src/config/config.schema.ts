import { z } from 'zod';

export const NodeEnv = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test',
} as const;

const nodeEnvArray = Object.values(NodeEnv) as [string, ...string[]];
export const nodeEnvEnum = z.enum(nodeEnvArray);

export const envSchema = z.object({
  NODE_ENV: nodeEnvEnum.default('development'),
  PORT: z.coerce.number().default(3000),
  DB_HOST: z.string().default('postgres'),
  DB_PORT: z.coerce.number().default(5432),
  DB_USER: z.string().default('postgres'),
  DB_PASSWORD: z.string().default('postgres'),
  DB_NAME: z.string().default('app_db'),
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'])
    .default('info'),
  CORS_ORIGINS: z.string().default('*'),
  AUTH0_DOMAIN: z.string(),
  AUTH0_AUDIENCE: z.string(),
  JWT_EXPIRATION: z.coerce.number().default(3600),
  JWT_SECRET: z.string().default('secret'),
  RATE_LIMIT_TIME_WINDOW: z.coerce.number().default(60),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
});

export type EnvConfig = z.infer<typeof envSchema>;
export type NodeEnv = z.infer<typeof nodeEnvEnum>;
