import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { CustomLoggerService } from '../logger/custom-logger.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private customLoggerService: CustomLoggerService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (this.isErrorStatusCode(status)) {
      console.log('error hererehrerhereh');
      //   this.customLoggerService.error(exception);
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: (exception.getResponse() as any).message,
    });
  }

  private isErrorStatusCode(statusCode: number): boolean {
    return statusCode >= 400 && statusCode < 600;
  }
}
