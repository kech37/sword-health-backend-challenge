import { DataSource, QueryRunner } from 'typeorm';
import { EventEmitter } from 'typeorm/platform/PlatformTools';
import { SwordHealthBackendChallengeService } from '../sword-health-backend-challenge-service';
import { LifeCycleManager } from './life-cicle-manager';

const INIT_CONNECTION_EMITTER = 'init_db_emitter';

export class DatabaseService extends LifeCycleManager {
  dataSource: DataSource;

  retryTimeout?: NodeJS.Timeout;

  private eventEmitter: EventEmitter;

  retry: boolean;

  retryDealyMs: number;

  constructor(service: SwordHealthBackendChallengeService, retry = true, retryDelayMs = 3000) {
    super(service.logger);
    this.retry = retry;
    this.retryDealyMs = retryDelayMs;

    this.eventEmitter = new EventEmitter();

    this.dataSource = new DataSource({
      type: 'mysql',
      host: process.env.database_host,
      port: +process.env.database_port!,
      username: process.env.database_username,
      password: process.env.database_password,
      database: process.env.database_database,

      entities: ['./db/entities/*.js'],
      migrations: ['./db/migrations/*.js'],
      migrationsRun: true,
      migrationsTransactionMode: 'all',
      synchronize: false,
      logging: 'all',
      logger: {
        logQuery: (query: string, parameters?: unknown[], _queryRunner?: QueryRunner): void => {
          this.logger.debug({ query, parameters }, 'DatabaseService: logQuery');
        },

        logQueryError: (error: string | Error, query: string, parameters?: unknown[], _queryRunner?: QueryRunner): void => {
          this.logger.error({ query, parameters, error }, 'DatabaseService: logQueryError');
        },

        logQuerySlow: (time: number, query: string, parameters?: unknown[], _queryRunner?: QueryRunner): void => {
          this.logger.warn({ parameters, query, time }, 'DatabaseService: logQuerySlow');
        },

        logSchemaBuild: (message: string, _queryRunner?: QueryRunner): void => {
          this.logger.info({ message }, 'DatabaseService: logSchemaBuild');
        },

        logMigration: (message: string, _queryRunner?: QueryRunner): void => {
          this.logger.info({ message }, 'DatabaseService: logMigration');
        },

        log: (level: 'log' | 'info' | 'warn', message: unknown, _queryRunner?: QueryRunner): void => {
          switch (level) {
            case 'log':
              this.logger.debug({ message }, 'DatabaseService: log');
              break;
            case 'warn':
              this.logger.warn({ message }, 'DatabaseService: log');
              break;
            case 'info':
            default:
              this.logger.info({ message }, 'DatabaseService: log');
          }
        },
      },
    });
  }

  async start(): Promise<void> {
    try {
      this.logger.debug('DatabaseService: start');
      await this.dataSource.initialize();
      this.logger.info('start: Connection successful');
      this.retryTimeout = undefined;

      this.eventEmitter.emit(INIT_CONNECTION_EMITTER, true);
    } catch (error) {
      if (this.retry) {
        this.logger.error({ error }, 'start: error');
        this.retryTimeout = setTimeout(() => {
          this.start();
        }, this.retryDealyMs);
      } else {
        throw error;
      }
    }
  }

  async stop(): Promise<void> {
    clearTimeout(this.retryTimeout);

    if (this.dataSource.isInitialized) {
      await this.dataSource.destroy();
    }
  }
}
