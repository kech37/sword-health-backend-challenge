import { Request, Response } from 'express';
import { SpecificErrorDescription } from '../@types/specific-error-description';
import { ApplicationError } from '../errors/models/application-error';
import { LoggerInstance } from '../services/logger-service';

export type AsyncRequestHandler = (request: Request, response: Response) => Promise<Response>;

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
        return response.status(500).send(error);
      }
    };
  }

  static createApplicationError(specificErrorDescription: SpecificErrorDescription, error?: unknown): ApplicationError {
    return new ApplicationError(specificErrorDescription.code.toString(), specificErrorDescription.description, {
      cause: error,
    });
  }
}
