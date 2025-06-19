import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ZodSchema, ZodFormattedError } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  public transform(value: unknown, metadata: ArgumentMetadata): unknown {
    // Lookup the DTO’s static `schema` property:
    const metatype = metadata.metatype as
      | { schema: ZodSchema<unknown> }
      | undefined;

    const schema: ZodSchema<unknown> | undefined =
      metatype?.schema instanceof ZodSchema
        ? metatype.schema
        : undefined;

    // If there’s no Zod schema, pass through:
    if (!schema) {
      return value;
    }

    // Validate:
    const result = schema.safeParse(value);
    if (!result.success) {
      // Throw a BadRequest with the formatted errors:
      const formatted: ZodFormattedError<unknown> = result.error.format();
      throw new BadRequestException({
        message: 'Validation failed',
        errors: formatted,
      });
    }

    // Return the typed, coerced value:
    return result.data;
  }
}
