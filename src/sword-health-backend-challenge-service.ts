import { json } from 'express';
import bearerToken from 'express-bearer-token';
import { DataSource } from 'typeorm';
import { LogLevel } from './@types/log-level';
import { BaseController } from './base/base-controller';
import { Config } from './configs/config';
import { RequestIdMiddleware } from './controllers/middlewares/request-id-middleware';
import { NotificationController } from './controllers/notification-controller';
import { TaskController } from './controllers/task-controller';
import { DatabaseService } from './services/database-service';
import { LifeCycleManager } from './services/life-cicle-manager';
import { LoggerService } from './services/logger-service';
import { MessageBrokerService } from './services/message-broker/message-broker-service';
import { WebServerService } from './services/web-server-service';

export class SwordHealthBackendChallengeService {
  private readonly logger: LoggerService;

  private readonly lifeCycleManager: LifeCycleManager;

  private readonly dataSource: DatabaseService;

  private readonly webServer: WebServerService;

  private readonly msgBroker: MessageBrokerService;

  private controllers: BaseController[];

  constructor(logLevel?: LogLevel) {
    this.logger = new LoggerService(this.constructor.name);

    this.logger.setLogLevel(logLevel ?? Config.LOG_LEVEL);

    this.lifeCycleManager = new LifeCycleManager(this.logger);
    this.lifeCycleManager.catchSignals();

    this.dataSource = this.lifeCycleManager.addService(new DatabaseService(this));
    this.webServer = this.lifeCycleManager.addService(new WebServerService(this, Config.HTTP_SERVER_PORT));
    this.msgBroker = this.lifeCycleManager.addService(new MessageBrokerService(this));

    this.webServer.use(json());
    this.webServer.use(bearerToken());
    this.webServer.use(RequestIdMiddleware);

    this.controllers = [];
  }

  get getLogger(): LoggerService {
    return this.logger;
  }

  get getDataSource(): DataSource {
    return this.dataSource.dataSource;
  }

  get getWebServer(): WebServerService {
    return this.webServer;
  }

  get getMsgBroker(): MessageBrokerService {
    return this.msgBroker;
  }

  private setupControllers(): void {
    this.controllers.push(TaskController.getInstance(this));
    this.controllers.push(NotificationController.getInstance(this));
  }

  async run(): Promise<this> {
    await this.lifeCycleManager.start();

    this.setupControllers();

    return this;
  }
}
