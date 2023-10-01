import { Request, Response } from 'express';
import { AsyncRequestHandler } from '../@types/async-request-handler';
import { HttpErrorCode } from '../@types/http-error-code';
import { SpecificErrorDescription } from '../@types/specific-error-description';
import { StandardApplicationErrorCode } from '../@types/standard-application-error-code';
import { AppSingletonErrors } from '../errors/generic/app-errors';
import { ApiError } from '../errors/models/api-error';
import { ApplicationError } from '../errors/models/application-error';
import { ErrorMapper } from '../mappers/error-mapper';
import { LoggerInstance } from '../services/logger-service';

export class ErrorUtils {
  private static instance?: ErrorUtils;

  private readonly logger: LoggerInstance;

  private constructor(logger: LoggerInstance) {
    this.logger = logger;
  }

  static getInstance(logger?: LoggerInstance): ErrorUtils {
    if (this.instance) {
      return this.instance;
    }
    if (!logger) {
      throw ErrorUtils.createApplicationError(AppSingletonErrors.LoggerNotDefined);
    }

    this.instance = new ErrorUtils(logger);
    return this.instance;
  }

  static handleError(response: Response, error: unknown): Response {
    if (error instanceof ApiError) {
      return response
        .status(error.httpErrorCode)
        .send(ErrorMapper.toHttpErrorResponse(response.locals.requestId, error.httpErrorCode, error.applicationErrorCode, error.applicationErrorMessage));
    }

    if (error instanceof ApplicationError) {
      return response
        .status(HttpErrorCode.HTTP_500_InternalServerError)
        .send(ErrorMapper.toHttpErrorResponse(response.locals.requestId, HttpErrorCode.HTTP_500_InternalServerError, error.errorCode, error.message));
    }

    if (error instanceof Error) {
      return response
        .status(HttpErrorCode.HTTP_500_InternalServerError)
        .send(
          ErrorMapper.toHttpErrorResponse(
            response.locals.requestId,
            HttpErrorCode.HTTP_500_InternalServerError,
            StandardApplicationErrorCode.INTERNAL_SERVER_ERROR,
          ),
        );
    }

    return response
      .status(HttpErrorCode.HTTP_500_InternalServerError)
      .send(ErrorMapper.toHttpErrorResponse(response.locals.requestId, HttpErrorCode.HTTP_500_InternalServerError, StandardApplicationErrorCode.UNKNOWN_ERROR));
  }

  wrap(handler: AsyncRequestHandler): AsyncRequestHandler {
    return async (request: Request, response: Response): Promise<Response> => {
      try {
        return await handler(request, response);
      } catch (error) {
        this.logger.error(error);
        return ErrorUtils.handleError(response, error);
      }
    };
  }

  static createApplicationError(specificErrorDescription: SpecificErrorDescription, error?: unknown): ApplicationError {
    return new ApplicationError(specificErrorDescription.code, specificErrorDescription.description, {
      cause: error,
    });
  }

  static createApiError(requestId: UUID, httpErrorCode: HttpErrorCode, specificErrorDescription: SpecificErrorDescription, error?: unknown): ApplicationError {
    return new ApiError(requestId, httpErrorCode, specificErrorDescription.code, specificErrorDescription.description, error);
  }
}
