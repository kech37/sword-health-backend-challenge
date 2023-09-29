import { DataSource } from 'typeorm';
import { Config } from './config';

export const setupDatabaseConfig = new DataSource({
  type: 'mysql',
  host: Config.DATABASE.HOST,
  port: Config.DATABASE.PORT,
  username: 'root',
  password: Config.DATABASE.ROOT_PASSWORD,
  database: Config.DATABASE.DATABASE,
  entities: ['./src/db/entities/*.ts'],
  migrations: ['./src/db/migrations/setup/*.ts'],
  synchronize: true,
});
