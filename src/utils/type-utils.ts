import { CreateTaskRequestBody } from '../@types/api/create-task-request-body';
import { JwtPayload } from '../@types/jwt-payload';
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
}
