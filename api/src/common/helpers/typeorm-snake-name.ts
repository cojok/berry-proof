import { DefaultNamingStrategy } from 'typeorm';

export class CustomSnakeNamingStrategy extends DefaultNamingStrategy {
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
