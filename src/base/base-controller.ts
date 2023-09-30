import { AsyncRequestHandlerErrorWrapper } from '../@types/async-request-handler';
import { LoggerInstance } from '../services/logger-service';
import { WebServerService } from '../services/web-server-service';
import { SwordHealthBackendChallengeService } from '../sword-health-backend-challenge-service';
import { ErrorUtils } from '../utils/error-utils';

export abstract class BaseController {
  readonly logger: LoggerInstance;

  readonly webServer: WebServerService;

  private readonly wrap: AsyncRequestHandlerErrorWrapper;

  constructor(service: SwordHealthBackendChallengeService) {
    this.logger = service.getLogger.get(this.constructor.name);
    this.webServer = service.getWebServer;
    this.wrap = ErrorUtils.getInstance(this.logger).wrap;
  }

  get errorFactory(): AsyncRequestHandlerErrorWrapper {
    return this.wrap;
  }
}
