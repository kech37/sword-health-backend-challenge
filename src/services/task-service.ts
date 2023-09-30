import { HttpErrorCode } from '../@types/http-error-code';
import { BaseController } from '../base/base-controller';
import { TaskFacade } from '../db/facades/task-facade';
import { UserFacade } from '../db/facades/user-facade';
import { ApiBadRequestErrors, ApiForbiddenErrors, ApiNotFoundErrors } from '../errors/generic/api-errors';
import { AppDatabaseErrors, AppSingletonErrors } from '../errors/generic/app-errors';
import { TaskModel } from '../models/task-model';
import { SwordHealthBackendChallengeService } from '../sword-health-backend-challenge-service';
import { ErrorUtils } from '../utils/error-utils';
import { TypeUtils } from '../utils/type-utils';
import { Utils } from '../utils/utils';

export class TaskService extends BaseController {
  private static instace?: TaskService;

  private readonly service: SwordHealthBackendChallengeService;

  private constructor(service: SwordHealthBackendChallengeService) {
    super(service);
    this.service = service;
  }

  static getInstance(service?: SwordHealthBackendChallengeService): TaskService {
    if (this.instace) {
      return this.instace;
    }
    if (!service) {
      throw ErrorUtils.createApplicationError(AppSingletonErrors.ServiceNotDefined);
    }
    this.instace = new TaskService(service);
    return this.instace;
  }

  async create(requestId: UUID, userId: UUID, summary: string, managerId?: UUID, technicianId?: UUID): Promise<TaskModel> {
    this.logger.info({ requestId, userId, summary, managerId, technicianId }, 'TaskService: create');

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
    this.logger.debug({ requestId, user }, 'create: user');

    if (Utils.isManagerRole(user.role)) {
      if (!TypeUtils.isUUID(technicianId)) {
        throw ErrorUtils.createApiError(requestId, HttpErrorCode.HTTP_400_BadRequest, ApiBadRequestErrors.InvalidCreateTaskRequestBody);
      }
      const technician = await UserFacade.getInstance(this.service).getById(requestId, technicianId);
      if (!technician) {
        throw ErrorUtils.createApiError(requestId, HttpErrorCode.HTTP_404_NotFound, ApiNotFoundErrors.UserNotFound);
      }
      this.logger.debug({ requestId, user }, 'create: technician');

      return TaskFacade.getInstance(this.service).create(requestId, summary, user.id, technician.id);
    }

    if (Utils.isTechnicianRole(user.role)) {
      if (!TypeUtils.isUUID(managerId)) {
        throw ErrorUtils.createApiError(requestId, HttpErrorCode.HTTP_400_BadRequest, ApiBadRequestErrors.InvalidCreateTaskRequestBody);
      }
      const manager = await UserFacade.getInstance(this.service).getById(requestId, managerId);
      if (!manager) {
        throw ErrorUtils.createApiError(requestId, HttpErrorCode.HTTP_404_NotFound, ApiNotFoundErrors.UserNotFound);
      }
      this.logger.debug({ requestId, user }, 'create: technician');

      return TaskFacade.getInstance(this.service).create(requestId, summary, manager.id, user.id);
    }

    throw ErrorUtils.createApiError(requestId, HttpErrorCode.HTTP_403_Forbidden, ApiForbiddenErrors.UnableToDetermineRole);
  }
}
