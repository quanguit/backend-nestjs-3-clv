import { Module } from '@nestjs/common';
import { LoggerModule as LoggerModulee } from 'nestjs-pino';
import { CustomLoggerService } from './custom-logger.service';

@Module({
  imports: [
    LoggerModulee.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),
  ],
  providers: [CustomLoggerService],
  exports: [CustomLoggerService],
})
export class LoggerModule {}
