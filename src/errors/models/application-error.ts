import { StandardApplicationErrorCode } from '../../@types/standard-application-error-code';

export class ApplicationError extends Error {
  errorCode: string;

  constructor(errorCode: string | StandardApplicationErrorCode, message?: string, options?: ErrorOptions) {
    super(message, options);

    this.errorCode = errorCode;
  }
}
