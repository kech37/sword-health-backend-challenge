import { HttpErrorCode } from '../../@types/http-error-code';
import { HttpErrorResponse } from '../../@types/http-error-response';
import { StandardApplicationErrorCode } from '../../@types/standard-application-error-code';
import { ErrorMapper } from '../../mappers/error-mapper';
import { ApplicationError } from './application-error';

export class ApiError extends ApplicationError implements HttpErrorResponse {
  requestId: string;

  httpErrorCode: HttpErrorCode;

  applicationErrorCode: string;

  applicationErrorMessage: string;

  cause?: unknown;

  constructor(requestId: string, httpErrorCode: HttpErrorCode, applicationErrorCode: string, applicationErrorMessage: string, cause?: unknown) {
    super(StandardApplicationErrorCode.API_ERROR, ErrorMapper.httpErrorCodeToString(httpErrorCode));

    this.requestId = requestId;

    this.httpErrorCode = httpErrorCode;

    this.applicationErrorCode = applicationErrorCode;
    this.applicationErrorMessage = applicationErrorMessage;

    this.cause = cause;
  }
}
