import { AsyncRequestHandlerErrorWrapper } from '../@types/async-request-handler';
import { HttpErrorCode } from '../@types/http-error-code';
import { UserFacade } from '../db/facades/user-facade';
import { ApiNotFoundErrors } from '../errors/generic/api-errors';
import { AppDatabaseErrors } from '../errors/generic/app-errors';
import { RoleModel } from '../models/role-model';
import { UserModel } from '../models/user-model';
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

  async auxGetUser(requestId: UUID, userId: UUID): Promise<[UserModel, RoleModel]> {
    this.logger.info({ requestId, userId }, 'BaseController: auxGetUser');
    const user = await UserFacade.getInstance(this.service).getById(requestId, userId, {
      load: {
        role: true,
      },
    });
    if (!user) {
      throw ErrorUtils.createApiError(requestId, HttpErrorCode.HTTP_404_NotFound, ApiNotFoundErrors.UserNotFound);
    }
    if (!user.role) {
      throw ErrorUtils.createApplicationError(AppDatabaseErrors.Relations.RoleNotLoaded);
    }
    this.logger.debug({ requestId, user }, 'auxGetUser: user');

    return [user, user.role];
  }
}
