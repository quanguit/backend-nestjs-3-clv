import { Injectable } from '@nestjs/common';
import { Logger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class CustomLoggerService extends Logger {
  protected logger: PinoLogger;

  log(message: any, ...optionalParams: any[]): void {
    this.logger.info(message, ...optionalParams);
  }

  error(message: any, ...optionalParams: any[]): void {
    console.log('error in exception filter ================');
    this.logger.error(message, ...optionalParams);
  }

  debug(message: any, ...optionalParams: any[]): void {
    this.logger.debug(message, ...optionalParams);
  }

  warn(message: any, ...optionalParams: any[]): void {
    this.logger.warn(message, ...optionalParams);
  }

  verbose(message: any, ...optionalParams: any[]): void {
    this.logger.trace(message, ...optionalParams);
  }
}
