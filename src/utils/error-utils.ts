import { Request, Response } from 'express';
import { AsyncRequestHandler } from '../@types/async-request-handler';
import { HttpErrorCode } from '../@types/http-error-code';
import { SpecificErrorDescription } from '../@types/specific-error-description';
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
      throw new Error();
    }

    this.instance = new ErrorUtils(logger);
    return this.instance;
  }

  wrap(handler: AsyncRequestHandler): AsyncRequestHandler {
    return async (request: Request, response: Response): Promise<Response> => {
      try {
        return await handler(request, response);
      } catch (error) {
        this.logger.error(error);

        if (error instanceof ApplicationError) {
          return response
            .status(HttpErrorCode.HTTP_500_InternalServerError)
            .send(ErrorMapper.toHttpErrorResponse(response.locals.requestId, HttpErrorCode.HTTP_500_InternalServerError, error.errorCode, error.message));
        }

        if (error instanceof Error) {
          return response
            .status(HttpErrorCode.HTTP_500_InternalServerError)
            .send(ErrorMapper.toHttpErrorResponse(response.locals.requestId, HttpErrorCode.HTTP_500_InternalServerError));
        }

        return response
          .status(HttpErrorCode.HTTP_500_InternalServerError)
          .send(ErrorMapper.toHttpErrorResponse(response.locals.requestId, HttpErrorCode.HTTP_500_InternalServerError, 'UNKNOWN_ERROR'));
      }
    };
  }

  static createApplicationError(specificErrorDescription: SpecificErrorDescription, error?: unknown): ApplicationError {
    return new ApplicationError(specificErrorDescription.code.toString(), specificErrorDescription.description, {
      cause: error,
    });
  }
}
