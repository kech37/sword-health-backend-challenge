import { CreateTaskRequestBody } from '../@types/api/create-task-request-body';
import { DeleteTaskByIdParams } from '../@types/api/delete-task-by-id-params';
import { GetTaskByIdParams } from '../@types/api/get-task-by-id-params';
import { Notification, NotificationMetadata } from '../@types/api/notification';
import { UpdateTaskIdParams } from '../@types/api/update-task-id-params';
import { UpdateTaskRequestBody } from '../@types/api/update-task-request-body';
import { JwtPayload } from '../@types/jwt-payload';
import { NotificationType } from '../db/@types/notification-type';
import { TaskStatus } from '../db/@types/task-status';
import { AppTypeCheckErrors } from '../errors/generic/app-errors';
import { ErrorUtils } from './error-utils';
import { UuidUtils } from './uuid-utils';

export class TypeUtils {
  static isString(value: unknown): value is string {
    return typeof value === 'string';
  }

  static assertString(value: unknown): asserts value is string {
    if (!TypeUtils.isString(value)) {
      throw ErrorUtils.createApplicationError(AppTypeCheckErrors.NotAString);
    }
  }

  static isUUID(value: unknown): value is UUID {
    return this.isString(value) && UuidUtils.isValid(value);
  }

  static assertUUID(value: unknown): asserts value is UUID {
    if (!TypeUtils.isUUID(value)) {
      throw ErrorUtils.createApplicationError(AppTypeCheckErrors.NotAUUID);
    }
  }

  static isJwtPayload(value: unknown): value is JwtPayload {
    const assertedValue = value as JwtPayload;
    return this.isUUID(assertedValue.owner);
  }

  static assertJwtPayload(value: unknown): asserts value is JwtPayload {
    if (!TypeUtils.isJwtPayload(value)) {
      throw ErrorUtils.createApplicationError(AppTypeCheckErrors.NotAValidJwtPayload);
    }
  }

  static isCreateTaskRequestBody(value: unknown): value is CreateTaskRequestBody {
    const assertedValue = value as CreateTaskRequestBody;
    return (
      this.isString(assertedValue.summary) &&
      assertedValue.summary.length >= 1 &&
      assertedValue.summary.length <= 2500 &&
      (assertedValue.managerId === undefined || this.isUUID(assertedValue.managerId)) &&
      (assertedValue.technicianId === undefined || this.isUUID(assertedValue.technicianId))
    );
  }

  static isGetTaskByIdParams(value: unknown): value is GetTaskByIdParams {
    const assertedValue = value as GetTaskByIdParams;
    return this.isUUID(assertedValue.id);
  }

  static isStringNonNegativeInteger(value: unknown): value is StringNonNegativeInteger {
    return this.isString(value) && /^\d*$/.test(value);
  }

  static assertsStringNonNegativeInteger(value: unknown): asserts value is StringNonNegativeInteger {
    if (!this.isStringNonNegativeInteger(value)) {
      throw ErrorUtils.createApplicationError(AppTypeCheckErrors.NotAValidStringNonNegativeInteger);
    }
  }

  static isTaskStatus(value: unknown): value is TaskStatus {
    return this.isString(value) && Object.values<string>(TaskStatus).includes(value);
  }

  static isUpdateTaskIdParams(value: unknown): value is UpdateTaskIdParams {
    const assertedValue = value as UpdateTaskIdParams;
    return this.isUUID(assertedValue.id);
  }

  static isUpdateTaskRequestBody(value: unknown): value is UpdateTaskRequestBody {
    const assertedValue = value as UpdateTaskRequestBody;
    return (
      (assertedValue.status === undefined || this.isTaskStatus(assertedValue.status)) &&
      (assertedValue.summary === undefined ||
        (this.isString(assertedValue.summary) && assertedValue.summary.length >= 1 && assertedValue.summary.length <= 2500))
    );
  }

  static isDeleteTaskByIdParams(value: unknown): value is DeleteTaskByIdParams {
    const assertedValue = value as DeleteTaskByIdParams;
    return this.isUUID(assertedValue.id);
  }

  static isNotificationMetadata(value: unknown): value is NotificationMetadata {
    const assertedValue = value as NotificationMetadata;
    return this.isUUID(assertedValue.taskId);
  }

  static isBoolean(value: unknown): value is boolean {
    return typeof value === 'boolean';
  }

  static isDateString(value: unknown): value is DateString {
    return this.isString(value) && /^\d{4}(-\d\d(-\d\d(T\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d:\d\d)|Z)?)?)?)?$/.test(value);
  }

  static isNotification(value: unknown): value is Notification {
    const assertedValue = value as Notification;
    return (
      this.isUUID(assertedValue.id) &&
      assertedValue.type === NotificationType.TASK_COMPLETED &&
      this.isUUID(assertedValue.toUserId) &&
      this.isNotificationMetadata(assertedValue.metadata) &&
      this.isBoolean(assertedValue.isRead) &&
      this.isDateString(assertedValue.createdAt)
    );
  }

  static assertsNotification(value: unknown): asserts value is Notification {
    if (!this.isNotification(value)) {
      throw ErrorUtils.createApplicationError(AppTypeCheckErrors.NotAValidNotification);
    }
  }
}
