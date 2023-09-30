import { GetNotificationsResponse } from '../@types/api/get-notifications-response';
import { NotificationResponse } from '../@types/api/notification-response';
import { Task } from '../@types/api/task';
import { TaskSummary } from '../@types/api/task-summary';
import { User } from '../@types/api/user';
import { PaginatedResponse } from '../@types/paginated-response';
import { AppDatabaseErrors } from '../errors/generic/app-errors';
import { NotificationModel } from '../models/notification-model';
import { TaskModel } from '../models/task-model';
import { UserModel } from '../models/user-model';
import { ErrorUtils } from './error-utils';

export class ResponseBuilder {
  static toUser(model: UserModel): User {
    return {
      id: model.id,
      name: model.name,
    };
  }

  static toTask(model: TaskModel): Task {
    if (!model.manager || !model.technician) {
      throw ErrorUtils.createApplicationError(AppDatabaseErrors.Relations.UserNotLoaded);
    }

    return {
      id: model.id,
      status: model.status,
      summary: model.summary,
      manager: this.toUser(model.manager),
      technician: this.toUser(model.technician),
      createdAt: model.createdAt.toISOString(),
      completedAt: model.completedAt?.toISOString(),
    };
  }

  static toGetTasksResponse(models: TaskModel[], total: number): PaginatedResponse<Task> {
    return {
      result: models.map((e) => this.toTask(e)),
      total,
    };
  }

  static toTaskSummary(taskModel: TaskModel): TaskSummary {
    return {
      id: taskModel.id,
      summary: taskModel.summary,
      createdAt: taskModel.createdAt.toISOString(),
    };
  }

  static toNotificationResponse(notificationModel: NotificationModel, tasksModels: TaskModel[]): NotificationResponse {
    const task = tasksModels.find((e) => e.id === notificationModel.metadata?.taskId);
    if (!task) {
      throw new Error(); // TODO
    }
    if (!task.technician) {
      throw new Error(); // TODO
    }

    return {
      id: notificationModel.id,
      type: notificationModel.type,
      task: this.toTaskSummary(task),
      technician: this.toUser(task.technician),
      createdAt: notificationModel.createdAt.toISOString(),
      completedAt: task.createdAt.toISOString(),
    };
  }

  static toGetNotificationsResponse(notifications: NotificationModel[], tasksModels: TaskModel[], total: number): GetNotificationsResponse {
    return { result: notifications.map((e) => this.toNotificationResponse(e, tasksModels)), total };
  }
}
