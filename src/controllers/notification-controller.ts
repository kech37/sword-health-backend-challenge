import { Request, Response } from 'express';
import { PaginatedRequestQuery } from '../@types/api/paginated-request-query';
import { HttpErrorCode } from '../@types/http-error-code';
import { WebMethod } from '../@types/web-method';
import { BaseController } from '../base/base-controller';
import { ApiBadRequestErrors } from '../errors/generic/api-errors';
import { AppSingletonErrors } from '../errors/generic/app-errors';
import { NotificationService } from '../services/notification-service';
import { SwordHealthBackendChallengeService } from '../sword-health-backend-challenge-service';
import { ErrorUtils } from '../utils/error-utils';
import { ResponseBuilder } from '../utils/response-builder';
import { TypeUtils } from '../utils/type-utils';
import { JwtAuthenticationMiddleware } from './middlewares/jwt-authentication-middleware';

export class NotificationController extends BaseController {
  private static instace?: NotificationController;

  private readonly service: SwordHealthBackendChallengeService;

  private constructor(service: SwordHealthBackendChallengeService) {
    super(service);
    this.service = service;

    this.webServer.on(
      WebMethod.GET,
      '/notification',
      (req, res, next) => JwtAuthenticationMiddleware.getInstance().getMiddleware(req, res, next),
      this.errorFactory((req, res) => NotificationController.getInstance().get(req, res)),
    );

    this.webServer.on(
      WebMethod.PATCH,
      '/notification/:id',
      (req, res, next) => JwtAuthenticationMiddleware.getInstance().getMiddleware(req, res, next),
      this.errorFactory((req, res) => NotificationController.getInstance().update(req, res)),
    );
  }

  static getInstance(service?: SwordHealthBackendChallengeService): NotificationController {
    if (this.instace) {
      return this.instace;
    }
    if (!service) {
      throw ErrorUtils.createApplicationError(AppSingletonErrors.ServiceNotDefined);
    }
    this.instace = new NotificationController(service);
    return this.instace;
  }

  private async get(request: Request, response: Response): Promise<Response> {
    const { requestId, jwtPayload } = response.locals;
    TypeUtils.assertUUID(requestId);

    TypeUtils.assertJwtPayload(jwtPayload);
    const { owner: userId } = jwtPayload;

    const parsedQuery: PaginatedRequestQuery = {};
    try {
      const { limit, skip } = request.query;
      if (limit) {
        TypeUtils.assertsStringNonNegativeInteger(limit);
        parsedQuery.limit = limit;
      }
      if (skip) {
        TypeUtils.assertsStringNonNegativeInteger(skip);
        parsedQuery.skip = skip;
      }
    } catch (_e) {
      throw ErrorUtils.createApiError(requestId, HttpErrorCode.HTTP_400_BadRequest, ApiBadRequestErrors.InvalidGetTasksRequestQuery);
    }

    this.logger.info({ requestId, userId }, 'NotificationController: get');

    const [{ result, total }, tasks] = await NotificationService.getInstance(this.service).get(
      requestId,
      userId,
      parsedQuery.limit ? Number.parseInt(parsedQuery.limit, 10) : 10,
      parsedQuery.skip ? Number.parseInt(parsedQuery.skip, 10) : 0,
    );
    this.logger.debug({ requestId, result, total }, 'get: result, total, tasks');

    return response.status(HttpErrorCode.HTTP_200_OK).send(ResponseBuilder.toGetNotificationsResponse(result, tasks, total));
  }

  private async update(request: Request, response: Response): Promise<Response> {
    const { requestId, jwtPayload } = response.locals;
    TypeUtils.assertUUID(requestId);

    TypeUtils.assertJwtPayload(jwtPayload);
    const { owner: userId } = jwtPayload;

    const { params, body } = request;
    if (!TypeUtils.isUpdateNotificationByIdParams(params)) {
      throw ErrorUtils.createApiError(requestId, HttpErrorCode.HTTP_400_BadRequest, ApiBadRequestErrors.InvalidUpdateNotificationByIdParams);
    }
    if (!TypeUtils.isUpdateNotificationRequestBody(body)) {
      throw ErrorUtils.createApiError(requestId, HttpErrorCode.HTTP_400_BadRequest, ApiBadRequestErrors.InvalidUpdateNotificationRequestBody);
    }

    this.logger.info({ requestId, userId, params, body }, 'NotificationController: update');

    const [updatedNotification, task] = await NotificationService.getInstance(this.service).update(requestId, userId, params.id, body.isRead);

    this.logger.debug({ requestId, updatedNotification, task }, 'update: updatedNotification, task');

    return response.status(HttpErrorCode.HTTP_200_OK).send(ResponseBuilder.toNotificationResponse(updatedNotification, [task]));
  }
}
