import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Brings every HTTP error to one shape:
 * { statusCode, error, message, path, timestamp }.
 * `message` is a string, or an array of strings for validation errors.
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const body =
      typeof exceptionResponse === 'string'
        ? { message: exceptionResponse, error: exception.name }
        : (exceptionResponse as {
            message?: string | string[];
            error?: string;
          });

    const message = body.message ?? exception.message;
    const error = body.error ?? exception.name;

    this.logger.warn(
      `${request.method} ${request.url} -> ${status}: ${JSON.stringify(message)}`,
    );

    response.status(status).json({
      statusCode: status,
      error,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
