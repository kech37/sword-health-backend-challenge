import { Config } from '../configs/config';
import { LifeCycleManager } from '../services/life-cicle-manager';
import { LoggerService } from '../services/logger-service';

export class BaseService {
  name: string;

  logger: LoggerService;

  lifeCycleManager: LifeCycleManager;

  constructor(name: string) {
    this.name = name;

    this.logger = new LoggerService(name);

    this.logger.setLogLevel(Config.LOG_LEVEL);

    this.lifeCycleManager = new LifeCycleManager(this.logger);
    this.lifeCycleManager.catchSignals();
  }

  run(): this {
    this.lifeCycleManager.start();
    return this;
  }

  stop(): this {
    this.lifeCycleManager.stop();
    return this;
  }
}
