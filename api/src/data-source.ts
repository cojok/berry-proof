import 'dotenv/config';
import { DataSource, DefaultNamingStrategy } from 'typeorm';

class CustomSnakeNamingStrategy extends DefaultNamingStrategy {
  tableName(className: string, customName: string): string {
    return customName ? customName : this.camelToSnakeCase(className);
  }

  columnName(
    propertyName: string,
    customName: string,
    _embeddedPrefixes: string[],
  ): string {
    return customName ? customName : this.camelToSnakeCase(propertyName);
  }

  private camelToSnakeCase(str: string): string {
    return str
      .replace(/([A-Z])/g, '_$1')
      .toLowerCase()
      .replace(/^_/, '');
  }
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['dist/entities/**/*.js'],
  migrations: ['dist/migrations/*.js'],
  namingStrategy: new CustomSnakeNamingStrategy(),
  logger: 'advanced-console',
});
