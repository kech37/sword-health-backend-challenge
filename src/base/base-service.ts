import { LoggerInstance } from '../services/logger-service';
import { SwordHealthBackendChallengeService } from '../sword-health-backend-challenge-service';

export abstract class BaseService {
  readonly logger: LoggerInstance;

  constructor(service: SwordHealthBackendChallengeService) {
    this.logger = service.getLogger.get(this.constructor.name);
  }
}
