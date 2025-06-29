import 'dotenv/config';
import { DataSource } from 'typeorm';
import { CustomSnakeNamingStrategy } from './common/helpers';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['dist/entities/*.js'],
  migrations: ['dist/migrations/*.js'],
  namingStrategy: new CustomSnakeNamingStrategy(),
});
