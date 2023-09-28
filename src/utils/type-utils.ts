import { JwtPayload } from '../@types/jwt-payload';
import { AppTypeCheckErrors } from '../errors/generic/app-errors';
import { ErrorUtils } from './error-utils';
import { UuidUtils } from './uuid-utils';

export class TypeUtils {
  static isString(value: unknown): value is string {
    return typeof value === 'string';
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
}
