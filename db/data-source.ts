import { ConfigService } from '@nestjs/config';
import { DatabaseConfigService } from 'src/database/database.service';
import { DataSource } from 'typeorm';

const configService = new ConfigService();

const dataSource = new DataSource(
  new DatabaseConfigService(configService).dataSourceOptions,
);

export default dataSource;
