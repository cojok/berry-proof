import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  DB_HOST: z.string().default('postgres'),
  DB_PORT: z.coerce.number().default(5432),
  DB_USER: z.string().default('postgres'),
  DB_PASSWORD: z.string().default('postgres'),
  DB_NAME: z.string().default('app_db'),
  LOG_LEVEL: z.enum(['fatal','error','warn','info','debug','trace']).default('info'),
  CORS_ORIGINS: z.string().default('*'),
});
export type EnvConfig = z.infer<typeof envSchema>;