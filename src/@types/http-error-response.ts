import { HttpErrorCode } from './http-error-code';

export interface HttpErrorResponse {
  requestId: string;

  httpErrorCode: HttpErrorCode;

  httpErrorMessage: string;

  applicationErrorCode?: string;

  applicationErrorMessage?: string;
}
