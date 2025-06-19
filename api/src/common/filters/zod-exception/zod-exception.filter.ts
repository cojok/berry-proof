import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ZodError } from 'zod';

interface ValidationError {
  path: string;
  message: string;
}

interface ExceptionResponseWithErrors {
  errors: ZodError | ValidationError[];
}

interface ErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  message: string;
  errors: ValidationError[];
}

@Catch(BadRequestException)
export class ZodExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus() || HttpStatus.BAD_REQUEST;

    const errors = this.extractValidationErrors(exception.getResponse());

    const errorResponse: ErrorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: 'Validation failed',
      errors,
    };

    response.status(status).json(errorResponse);
  }

  private extractValidationErrors(
    exceptionResponse: unknown,
  ): ValidationError[] {
    if (!this.isExceptionResponseWithErrors(exceptionResponse)) {
      return [];
    }

    const errorDetails = exceptionResponse.errors;
    return Array.isArray(errorDetails)
      ? errorDetails
      : [errorDetails as unknown as ValidationError];
  }

  private isExceptionResponseWithErrors(
    response: unknown,
  ): response is ExceptionResponseWithErrors {
    return (
      typeof response === 'object' && response !== null && 'errors' in response
    );
  }
}
