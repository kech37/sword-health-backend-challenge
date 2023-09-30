import { DataSource } from 'typeorm';
import { LoggerInstance } from '../services/logger-service';
import { SwordHealthBackendChallengeService } from '../sword-health-backend-challenge-service';

export abstract class BaseFacade {
  readonly logger: LoggerInstance;

  readonly dataSource: DataSource;

  constructor(service: SwordHealthBackendChallengeService) {
    this.logger = service.getLogger.get(this.constructor.name);
    this.dataSource = service.getDataSource;
  }
}
