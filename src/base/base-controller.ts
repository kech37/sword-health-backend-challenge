import { AsyncRequestHandlerErrorWrapper } from '../@types/async-request-handler';
import { LoggerInstance } from '../services/logger-service';
import { ErrorUtils } from '../utils/error-utils';
import { BaseService } from './base-service';

export abstract class BaseController<Service extends BaseService> {
  readonly logger: LoggerInstance;

  readonly service: Service;

  private readonly wrap: AsyncRequestHandlerErrorWrapper;

  constructor(service: Service) {
    this.service = service;
    this.logger = this.service.logger.get(this.constructor.name);
    this.wrap = ErrorUtils.getInstance(this.logger).wrap;
  }

  get errorFactory(): AsyncRequestHandlerErrorWrapper {
    return this.wrap;
  }
}
