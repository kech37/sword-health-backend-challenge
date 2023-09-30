import { Task } from '../@types/api/task';
import { User } from '../@types/api/user';
import { AppDatabaseErrors } from '../errors/generic/app-errors';
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
}
