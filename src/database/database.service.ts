import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

@Injectable()
export class DatabaseConfigService {
  constructor(private configService: ConfigService) {}

  get dataSourceOptions(): DataSourceOptions {
    return {
      type: 'postgres',
      host: this.configService.get<string>('DATABASE_HOST'),
      port: this.configService.get<number>('DATABASE_PORT'),
      username: this.configService.get<string>('DATABASE_USERNAME'),
      password: this.configService.get<string>('DATABASE_PASSWORD'),
      database: this.configService.get<string>('DATABASE_NAME'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      // logging: true,
    };
  }
}
