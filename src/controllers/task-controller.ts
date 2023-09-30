import { Request, Response } from 'express';
import { GetTasksRequestQuery } from '../@types/api/get-tasks-request-query';
import { HttpErrorCode } from '../@types/http-error-code';
import { WebMethod } from '../@types/web-method';
import { BaseController } from '../base/base-controller';
import { TaskStatus } from '../db/@types/task-status';
import { ApiBadRequestErrors } from '../errors/generic/api-errors';
import { AppSingletonErrors } from '../errors/generic/app-errors';
import { TaskService } from '../services/task-service';
import { SwordHealthBackendChallengeService } from '../sword-health-backend-challenge-service';
import { ErrorUtils } from '../utils/error-utils';
import { ResponseBuilder } from '../utils/response-builder';
import { TypeUtils } from '../utils/type-utils';
import { JwtAuthenticationMiddleware } from './middlewares/jwt-authentication-middleware';

export class TaskController extends BaseController {
  private static instace?: TaskController;

  private readonly service: SwordHealthBackendChallengeService;

  private constructor(service: SwordHealthBackendChallengeService) {
    super(service);
    this.service = service;

    this.webServer.on(
      WebMethod.GET,
      '/task',
      (req, res, next) => JwtAuthenticationMiddleware.getInstance().getMiddleware(req, res, next),
      this.errorFactory((req, res) => TaskController.getInstance().get(req, res)),
    );

    this.webServer.on(
      WebMethod.POST,
      '/task',
      (req, res, next) => JwtAuthenticationMiddleware.getInstance().getMiddleware(req, res, next),
      this.errorFactory((req, res) => TaskController.getInstance().create(req, res)),
    );

    this.webServer.on(
      WebMethod.GET,
      '/task/:id',
      (req, res, next) => JwtAuthenticationMiddleware.getInstance().getMiddleware(req, res, next),
      this.errorFactory((req, res) => TaskController.getInstance().getById(req, res)),
    );
  }

  static getInstance(service?: SwordHealthBackendChallengeService): TaskController {
    if (this.instace) {
      return this.instace;
    }
    if (!service) {
      throw ErrorUtils.createApplicationError(AppSingletonErrors.ServiceNotDefined);
    }
    this.instace = new TaskController(service);
    return this.instace;
  }

  private async get(request: Request, response: Response): Promise<Response> {
    const { requestId, jwtPayload } = response.locals;
    TypeUtils.assertUUID(requestId);

    TypeUtils.assertJwtPayload(jwtPayload);
    const { owner: userId } = jwtPayload;

    const parsedQuery: GetTasksRequestQuery = {};
    try {
      const { limit, skip, status, technicianId } = request.query;
      if (limit) {
        TypeUtils.assertsStringNonNegativeInteger(limit);
        parsedQuery.limit = limit;
      }
      if (skip) {
        TypeUtils.assertsStringNonNegativeInteger(skip);
        parsedQuery.skip = skip;
      }
      if (TypeUtils.isTaskStatus(status)) {
        parsedQuery.status = status;
      }
      if (technicianId) {
        TypeUtils.assertUUID(technicianId);
        parsedQuery.technicianId = technicianId;
      }
    } catch (_e) {
      throw ErrorUtils.createApiError(requestId, HttpErrorCode.HTTP_400_BadRequest, ApiBadRequestErrors.InvalidGetTasksRequestQuery);
    }
    if (parsedQuery.status === TaskStatus.ARCHIVED) {
      throw ErrorUtils.createApiError(requestId, HttpErrorCode.HTTP_400_BadRequest, ApiBadRequestErrors.InvalidGetTasksRequestQuery);
    }

    this.logger.info({ requestId, userId, parsedQuery }, 'TaskController: get');

    const { result, total } = await TaskService.getInstance(this.service).get(
      requestId,
      userId,
      parsedQuery.limit ? Number.parseInt(parsedQuery.limit, 10) : 10,
      parsedQuery.skip ? Number.parseInt(parsedQuery.skip, 10) : 0,
      parsedQuery.status,
      parsedQuery.technicianId,
    );
    this.logger.debug({ requestId, result, total }, 'get: result, total');

    return response.status(200).send(ResponseBuilder.toGetTasksResponse(result, total));
  }

  private async create(request: Request, response: Response): Promise<Response> {
    const { requestId, jwtPayload } = response.locals;
    TypeUtils.assertUUID(requestId);

    TypeUtils.assertJwtPayload(jwtPayload);
    const { owner: userId } = jwtPayload;

    const { body } = request;
    if (!TypeUtils.isCreateTaskRequestBody(body)) {
      throw ErrorUtils.createApiError(requestId, HttpErrorCode.HTTP_400_BadRequest, ApiBadRequestErrors.InvalidCreateTaskRequestBody);
    }

    this.logger.info({ requestId, userId, body }, 'TaskController: create');

    const result = await TaskService.getInstance(this.service).create(requestId, userId, body.summary, body.managerId, body.technicianId);
    this.logger.debug({ requestId, result }, 'create: result');

    return response.status(200).send(ResponseBuilder.toTask(result));
  }

  private async getById(request: Request, response: Response): Promise<Response> {
    const { requestId, jwtPayload } = response.locals;
    TypeUtils.assertUUID(requestId);

    TypeUtils.assertJwtPayload(jwtPayload);
    const { owner: userId } = jwtPayload;

    const { params } = request;
    if (!TypeUtils.isGetTaskByIdParams(params)) {
      throw ErrorUtils.createApiError(requestId, HttpErrorCode.HTTP_400_BadRequest, ApiBadRequestErrors.InvalidGetTaskByIdParams);
    }

    this.logger.info({ requestId, userId, params }, 'TaskController: getById');

    const result = await TaskService.getInstance(this.service).getById(requestId, userId, params.id);
    this.logger.debug({ requestId, result }, 'getById: result');

    return response.status(200).send(ResponseBuilder.toTask(result));
  }
}
