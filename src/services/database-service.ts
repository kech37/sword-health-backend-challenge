import { DataSource } from "typeorm";

export class DatabaseService {
  private static instance?: DatabaseService;

  private dataSource: DataSource;

  private constructor() {
    this.dataSource = new DataSource({
      type: "mysql",
      host: process.env.database_host,
      port: +process.env.database_port!,
      username: process.env.database_username,
      password: process.env.database_password,
      database: process.env.database_database,
      entities: ["./db/entities/*.js"],
      migrationsRun: true,
      migrationsTransactionMode: "all",
      synchronize: false,
      logging: "all",
      logger: "debug",
    });
  }

  static getInstance(): DatabaseService {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new DatabaseService();
    return this.instance;
  }

  async run(): Promise<void> {
    await this.dataSource.initialize();
  }

  getDataSource(): DataSource {
    return this.dataSource;
  }
}
