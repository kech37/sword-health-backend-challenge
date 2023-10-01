import { AsyncRequestHandlerErrorWrapper } from '../@types/async-request-handler';
import { LoggerInstance } from '../services/logger-service';
import { WebServerService } from '../services/web-server-service';
import { SwordHealthBackendChallengeService } from '../sword-health-backend-challenge-service';
import { ErrorUtils } from '../utils/error-utils';

export abstract class BaseController {
  readonly service: SwordHealthBackendChallengeService;

  readonly logger: LoggerInstance;

  readonly webServer: WebServerService;

  private readonly wrap: AsyncRequestHandlerErrorWrapper;

  constructor(service: SwordHealthBackendChallengeService) {
    this.service = service;
    this.logger = this.service.getLogger.get(this.constructor.name);
    this.webServer = this.service.getWebServer;
    this.wrap = ErrorUtils.getInstance(this.logger).wrap;
  }

  get errorFactory(): AsyncRequestHandlerErrorWrapper {
    return this.wrap;
  }
}
