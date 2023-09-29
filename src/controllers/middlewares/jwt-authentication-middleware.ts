import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { HttpErrorCode } from '../../@types/http-error-code';
import { Config } from '../../configs/config';
import { ApiUnauthorizedErrors } from '../../errors/generic/api-errors';
import { LoggerInstance, LoggerService } from '../../services/logger-service';
import { ErrorUtils } from '../../utils/error-utils';
import { TypeUtils } from '../../utils/type-utils';

export class JwtAuthenticationMiddleware {
  private static instance?: JwtAuthenticationMiddleware;

  private readonly logger: LoggerInstance;

  private constructor() {
    const logger = new LoggerService(this.constructor.name);
    logger.setLogLevel(Config.JWT_LOG_LEVEL);
    this.logger = logger.get();
  }

  static getInstance(): JwtAuthenticationMiddleware {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new JwtAuthenticationMiddleware();
    return this.instance;
  }

  getMiddleware(request: Request, response: Response, next: NextFunction): Response | void {
    try {
      const { requestId } = response.locals;
      const authorizationHeader = request.header('authorization');

      TypeUtils.assertUUID(requestId);
      this.logger.debug({ requestId, authorizationHeader }, 'JwtAuthenticationMiddleware: getMiddleware');

      if (!authorizationHeader) {
        this.logger.debug({ requestId }, 'getMiddleware: token not sent');
        throw ErrorUtils.createApiError(requestId, HttpErrorCode.HTTP_401_Unauthorized, ApiUnauthorizedErrors.MissingAccessToken);
      }

      try {
        const accessToken = authorizationHeader.split(' ').pop();
        TypeUtils.assertString(accessToken);

        response.locals.jwtPayload = jwt.verify(accessToken, Config.TOKEN_SCRET);
      } catch (error) {
        this.logger.error({ requestId, error }, 'getMiddleware: error');
        throw ErrorUtils.createApiError(requestId, HttpErrorCode.HTTP_401_Unauthorized, ApiUnauthorizedErrors.InvalidAccessToken, error);
      }
    } catch (error) {
      return ErrorUtils.handleError(response, error);
    }

    return next();
  }
}
