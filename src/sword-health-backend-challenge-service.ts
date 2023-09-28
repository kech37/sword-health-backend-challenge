import { DataSource } from 'typeorm';
import { BaseController } from './base/base-controller';
import { BaseService } from './base/base-service';
import { SetupController } from './controllers/setup-controller';
import { DatabaseService } from './services/database-service';
import { WebServerService } from './services/web-server-service';
import { RequestIdMiddleware } from './web-server/middlewares/request-id-middleware';

export class SwordHealthBackendChallengeService extends BaseService {
  private readonly webServer: WebServerService;

  private readonly dataSource: DatabaseService;

  private controllers: BaseController<SwordHealthBackendChallengeService>[];

  constructor() {
    super('Sword-Health-Backend-Challenge-Service');

    this.dataSource = this.lifeCycleManager.addService(new DatabaseService(this));
    this.webServer = this.lifeCycleManager.addService(new WebServerService(this, 3000));

    this.webServer.use(RequestIdMiddleware);

    this.controllers = [];
  }

  get getWebServer(): WebServerService {
    return this.webServer;
  }

  get getDataSource(): DataSource {
    return this.dataSource.dataSource;
  }

  private setupControllers(): void {
    this.controllers.push(SetupController.getInstance(this));
  }

  run(): this {
    super.run();

    this.setupControllers();

    return this;
  }
}
