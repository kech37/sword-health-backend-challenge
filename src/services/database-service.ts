import { DataSource, QueryRunner } from "typeorm";
import { LogService } from "./log-service";

export class DatabaseService {
  private dataSource: DataSource;

  constructor() {
    this.dataSource = new DataSource({
      type: "mysql",
      host: process.env.database_host,
      port: +process.env.database_port!,
      username: process.env.database_username,
      password: process.env.database_password,
      database: process.env.database_database,
      entities: ["./db/entities/*.js"],
      migrations: ["./db/migrations/*.js"],
      migrationsRun: true,
      migrationsTransactionMode: "all",
      synchronize: false,
      logging: "all",
      logger: {
        logQuery: (
          query: string,
          parameters?: unknown[],
          _queryRunner?: QueryRunner
        ): void => {
          LogService.getInstance().debug(
            { query, parameters },
            "DatabaseService: logQuery"
          );
        },

        logQueryError: (
          error: string | Error,
          query: string,
          parameters?: unknown[],
          _queryRunner?: QueryRunner
        ): void => {
          LogService.getInstance().error(
            { query, parameters, error },
            "DatabaseService: logQueryError"
          );
        },

        logQuerySlow: (
          time: number,
          query: string,
          parameters?: unknown[],
          _queryRunner?: QueryRunner
        ): void => {
          LogService.getInstance().warn(
            { parameters, query, time },
            "DatabaseService: logQuerySlow"
          );
        },

        logSchemaBuild: (message: string, _queryRunner?: QueryRunner): void => {
          LogService.getInstance().info(
            { message },
            "DatabaseService: logSchemaBuild"
          );
        },

        logMigration: (message: string, _queryRunner?: QueryRunner): void => {
          LogService.getInstance().info(
            { message },
            "DatabaseService: logMigration"
          );
        },

        log: (
          level: "log" | "info" | "warn",
          message: unknown,
          _queryRunner?: QueryRunner
        ): void => {
          switch (level) {
            case "log":
              LogService.getInstance().debug(
                { message },
                "DatabaseService: log"
              );
              break;
            case "warn":
              LogService.getInstance().warn(
                { message },
                "DatabaseService: log"
              );
              break;
            case "info":
            default:
              LogService.getInstance().info(
                { message },
                "DatabaseService: log"
              );
          }
        },
      },
    });
  }

  async run(): Promise<void> {
    await this.dataSource.initialize();
    LogService.getInstance().info("DatabaseService: initialized");
  }

  getDataSource(): DataSource {
    return this.dataSource;
  }
}
