import { HttpErrorCode } from '../@types/http-error-code';
import { PaginatedResponse } from '../@types/paginated-response';
import { BaseService } from '../base/base-service';
import { TaskStatus } from '../db/@types/task-status';
import { NotificationFacade } from '../db/facades/notification-facade';
import { TaskFacade } from '../db/facades/task-facade';
import { UserFacade } from '../db/facades/user-facade';
import { ApiBadRequestErrors, ApiForbiddenErrors, ApiNotFoundErrors } from '../errors/generic/api-errors';
import { AppSingletonErrors } from '../errors/generic/app-errors';
import { TaskModel } from '../models/task-model';
import { UserModel } from '../models/user-model';
import { SwordHealthBackendChallengeService } from '../sword-health-backend-challenge-service';
import { ErrorUtils } from '../utils/error-utils';
import { TypeUtils } from '../utils/type-utils';
import { Utils } from '../utils/utils';

export class TaskService extends BaseService {
  private static instace?: TaskService;

  private constructor(service: SwordHealthBackendChallengeService) {
    super(service);
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

  async get(requestId: UUID, userId: UUID, limit: number, skip: number, status?: TaskStatus, technicianId?: UUID): Promise<PaginatedResponse<TaskModel>> {
    this.logger.info({ requestId, userId, limit, skip, status, technicianId }, 'TaskService: get');

    const [user, userRole] = await this.auxGetUser(requestId, userId);
    this.logger.debug({ requestId, user }, 'get: user');

    let technicianIdToBeUsed: UUID | undefined;
    if (Utils.isManagerRole(userRole)) {
      technicianIdToBeUsed = technicianId;
    } else if (Utils.isTechnicianRole(userRole)) {
      if (technicianId && technicianId !== user.id) {
        throw ErrorUtils.createApiError(requestId, HttpErrorCode.HTTP_403_Forbidden, ApiForbiddenErrors.CannotPerformOperation);
      }
      technicianIdToBeUsed = user.id;
    } else {
      throw ErrorUtils.createApiError(requestId, HttpErrorCode.HTTP_403_Forbidden, ApiForbiddenErrors.UnableToDetermineRole);
    }

    const result = await TaskFacade.getInstance(this.service).get(requestId, limit, skip, status, technicianIdToBeUsed);
    this.logger.debug({ requestId, result }, 'get: result');

    return result;
  }

  private async createAsManager(requestId: UUID, managerUser: UserModel, summary: string, technicianId?: UUID): Promise<TaskModel> {
    this.logger.info({ requestId, managerUser, summary, technicianId }, 'TaskService: createAsManager');

    if (!TypeUtils.isUUID(technicianId)) {
      throw ErrorUtils.createApiError(requestId, HttpErrorCode.HTTP_400_BadRequest, ApiBadRequestErrors.InvalidCreateTaskRequestBody);
    }
    const technician = await UserFacade.getInstance(this.service).getById(requestId, technicianId);
    if (!technician) {
      throw ErrorUtils.createApiError(requestId, HttpErrorCode.HTTP_404_NotFound, ApiNotFoundErrors.UserNotFound);
    }
    this.logger.debug({ requestId, technician }, 'createAsManager: technician');

    return TaskFacade.getInstance(this.service).create(requestId, summary, managerUser.id, technician.id);
  }

  private async createAsTechnician(requestId: UUID, technicianUser: UserModel, summary: string, managerId?: UUID): Promise<TaskModel> {
    this.logger.info({ requestId, technicianUser, summary, managerId }, 'TaskService: createAsTechnician');
    if (!TypeUtils.isUUID(managerId)) {
      throw ErrorUtils.createApiError(requestId, HttpErrorCode.HTTP_400_BadRequest, ApiBadRequestErrors.InvalidCreateTaskRequestBody);
    }

    const [manager, managerRole] = await this.auxGetUser(requestId, managerId);
    if (!Utils.isManagerRole(managerRole)) {
      throw ErrorUtils.createApiError(requestId, HttpErrorCode.HTTP_403_Forbidden, ApiForbiddenErrors.CannotPerformOperation);
    }
    this.logger.debug({ requestId, manager, managerRole }, 'createAsTechnician: manager, managerRole');

    return TaskFacade.getInstance(this.service).create(requestId, summary, manager.id, technicianUser.id);
  }

  async create(requestId: UUID, userId: UUID, summary: string, managerId?: UUID, technicianId?: UUID): Promise<TaskModel> {
    this.logger.info({ requestId, userId, summary, managerId, technicianId }, 'TaskService: create');

    const [user, userRole] = await this.auxGetUser(requestId, userId);
    this.logger.debug({ requestId, user }, 'create: user');

    if (Utils.isManagerRole(userRole)) {
      return this.createAsManager(requestId, user, summary, technicianId);
    }

    if (Utils.isTechnicianRole(userRole)) {
      return this.createAsTechnician(requestId, user, summary, managerId);
    }

    throw ErrorUtils.createApiError(requestId, HttpErrorCode.HTTP_403_Forbidden, ApiForbiddenErrors.UnableToDetermineRole);
  }

  async getById(requestId: UUID, userId: UUID, id: UUID): Promise<TaskModel> {
    this.logger.info({ requestId, userId, id }, 'TaskService: getById');

    const [user, userRole] = await this.auxGetUser(requestId, userId);
    this.logger.debug({ requestId, user }, 'getById: user');

    const task = await TaskFacade.getInstance(this.service).getById(requestId, id);
    if (!task) {
      throw ErrorUtils.createApiError(requestId, HttpErrorCode.HTTP_404_NotFound, ApiNotFoundErrors.TaskNotFound);
    }
    this.logger.debug({ requestId, task }, 'getById: task');

    if (Utils.isManagerRole(userRole)) {
      return task;
    }

    if (Utils.isTechnicianRole(userRole)) {
      if (task.technicianId === user.id) {
        return task;
      }

      throw ErrorUtils.createApiError(requestId, HttpErrorCode.HTTP_403_Forbidden, ApiForbiddenErrors.CannotPerformOperation);
    }

    throw ErrorUtils.createApiError(requestId, HttpErrorCode.HTTP_403_Forbidden, ApiForbiddenErrors.UnableToDetermineRole);
  }

  async update(requestId: UUID, userId: UUID, id: UUID, status?: TaskStatus, summary?: string): Promise<TaskModel> {
    this.logger.info({ requestId, userId, id, status, summary }, 'TaskService: update');

    const [user] = await this.auxGetUser(requestId, userId);
    this.logger.debug({ requestId, user }, 'update: user');

    const task = await TaskFacade.getInstance(this.service).getById(requestId, id);
    if (!task) {
      throw ErrorUtils.createApiError(requestId, HttpErrorCode.HTTP_404_NotFound, ApiNotFoundErrors.TaskNotFound);
    }
    this.logger.debug({ requestId, task }, 'update: task');

    if (task.status === TaskStatus.COMPLETED || (task.status !== TaskStatus.NEW && summary) || task.technicianId !== user.id) {
      throw ErrorUtils.createApiError(requestId, HttpErrorCode.HTTP_403_Forbidden, ApiForbiddenErrors.CannotPerformOperation);
    }

    const result = await TaskFacade.getInstance(this.service).update(requestId, task.id, status, summary);
    this.logger.debug({ requestId, result }, 'update: result');

    if (result.status === TaskStatus.COMPLETED) {
      const notification = await NotificationFacade.getInstance(this.service).create(requestId, task);
      this.logger.debug({ requestId, notification }, 'update: notification');

      const isPublished = this.service.getMsgBroker.publish(requestId, notification.toUserId, notification);
      this.logger.debug({ requestId, isPublished }, 'update: isPublished');
    }

    return result;
  }

  async delete(requestId: UUID, userId: UUID, id: UUID): Promise<void> {
    this.logger.info({ requestId, userId, id }, 'TaskService: delete');

    const [user, userRole] = await this.auxGetUser(requestId, userId);
    this.logger.debug({ requestId, user }, 'update: user');

    const task = await TaskFacade.getInstance(this.service).getById(requestId, id);
    if (!task) {
      throw ErrorUtils.createApiError(requestId, HttpErrorCode.HTTP_404_NotFound, ApiNotFoundErrors.TaskNotFound);
    }
    this.logger.debug({ requestId, task }, 'update: task');

    if (!Utils.isManagerRole(userRole) || (Utils.isManagerRole(userRole) && task.managerId !== user.id)) {
      throw ErrorUtils.createApiError(requestId, HttpErrorCode.HTTP_403_Forbidden, ApiForbiddenErrors.CannotPerformOperation);
    }

    if (task.status !== TaskStatus.COMPLETED) {
      await TaskFacade.getInstance(this.service).delete(requestId, task.id);
    } else {
      await TaskFacade.getInstance(this.service).update(requestId, task.id, TaskStatus.ARCHIVED);
    }
    this.logger.debug({ requestId }, 'delete: ok');
  }
}
