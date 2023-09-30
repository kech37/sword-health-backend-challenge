import { HttpErrorCode } from '../@types/http-error-code';
import { PaginatedResponse } from '../@types/paginated-response';
import { BaseController } from '../base/base-controller';
import { NotificationFacade } from '../db/facades/notification-facade';
import { TaskFacade } from '../db/facades/task-facade';
import { UserFacade } from '../db/facades/user-facade';
import { ApiForbiddenErrors, ApiNotFoundErrors } from '../errors/generic/api-errors';
import { AppDatabaseErrors, AppSingletonErrors } from '../errors/generic/app-errors';
import { NotificationModel } from '../models/notification-model';
import { TaskModel } from '../models/task-model';
import { SwordHealthBackendChallengeService } from '../sword-health-backend-challenge-service';
import { ErrorUtils } from '../utils/error-utils';
import { TypeUtils } from '../utils/type-utils';
import { Utils } from '../utils/utils';

export class NotificationService extends BaseController {
  private static instace?: NotificationService;

  private readonly service: SwordHealthBackendChallengeService;

  private constructor(service: SwordHealthBackendChallengeService) {
    super(service);
    this.service = service;
  }

  static getInstance(service?: SwordHealthBackendChallengeService): NotificationService {
    if (this.instace) {
      return this.instace;
    }
    if (!service) {
      throw ErrorUtils.createApplicationError(AppSingletonErrors.ServiceNotDefined);
    }
    this.instace = new NotificationService(service);
    return this.instace;
  }

  async get(requestId: UUID, userId: UUID, limit: number, skip: number): Promise<[PaginatedResponse<NotificationModel>, TaskModel[]]> {
    this.logger.info({ requestId, userId }, 'NotificationService: get');

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
    this.logger.debug({ requestId, user }, 'get: user');

    if (Utils.isTechnicianRole(user.role)) {
      throw ErrorUtils.createApiError(requestId, HttpErrorCode.HTTP_403_Forbidden, ApiForbiddenErrors.CannotPerformOperation);
    }

    const { result: notifications, total } = await NotificationFacade.getInstance(this.service).get(requestId, limit, skip, user.id, false);
    this.logger.debug({ requestId, notifications, total }, 'get: notifications, total');

    const tasksIds = Array.from(new Set(TypeUtils.getNonNullableArray(notifications.map((e) => e.metadata?.taskId))));
    this.logger.debug({ requestId, tasksIds }, 'get: tasksIds');

    const tasks = await TaskFacade.getInstance(this.service).getSet(requestId, tasksIds);
    this.logger.debug({ requestId, tasks }, 'get: tasks');

    return [{ result: notifications, total }, tasks];
  }
}
