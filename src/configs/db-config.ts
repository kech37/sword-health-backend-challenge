import { DataSource } from 'typeorm';
import { Config } from './config';

export const dataSource = new DataSource({
  type: 'mysql',
  host: Config.DATABASE.HOST,
  port: Config.DATABASE.PORT,
  username: Config.DATABASE.USERNAME,
  password: Config.DATABASE.PASSWORD,
  database: Config.DATABASE.DATABASE,
  entities: ['./src/db/entities/*.ts'],
  migrations: ['./src/db/migrations/*.ts'],
  synchronize: true,
});
