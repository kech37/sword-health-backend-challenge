import { LoggerInstance } from '../services/logger-service';
import { BaseService } from './base-service';

export abstract class BaseController<Service extends BaseService> {
  readonly logger: LoggerInstance;

  readonly service: Service;

  constructor(service: Service) {
    this.service = service;
    this.logger = this.service.logger.get(this.constructor.name);
  }
}
