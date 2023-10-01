import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { HttpErrorCode } from '../@types/http-error-code';
import { LogLevel } from '../@types/log-level';
import { PaginatedResponse } from '../@types/paginated-response';
import { Mock } from '../configs/mock';
import { TaskFacade } from '../db/facades/task-facade';
import { UserFacade } from '../db/facades/user-facade';
import { ApiForbiddenErrors } from '../errors/generic/api-errors';
import { AppSingletonErrors } from '../errors/generic/app-errors';
import { ApplicationError } from '../errors/models/application-error';
import { TaskModel } from '../models/task-model';
import { SwordHealthBackendChallengeService } from '../sword-health-backend-challenge-service';
import { ErrorUtils } from '../utils/error-utils';
import { TaskService } from './task-service';

function getPaginatedResponse<T>(result: T[]): PaginatedResponse<T> {
  return {
    result,
    total: result.length,
  };
}

describe('Task service', () => {
  const service = new SwordHealthBackendChallengeService();

  service.getLogger.setLogLevel(LogLevel.FATAL);

  const sandbox = createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  context('instance', () => {
    it('should throw service not defined error', () => {
      const error = expect(() => {
        TaskService.getInstance();
      }).to.throw(ApplicationError);

      error.that.has.property('message', AppSingletonErrors.ServiceNotDefined.description);
      error.that.has.property('errorCode', AppSingletonErrors.ServiceNotDefined.code);
    });
  });

  context('GET /task', () => {
    it('should throw CANNONT_PERFORM_OPERATION error', async () => {
      try {
        sandbox.stub(UserFacade.getInstance(service), 'getById').resolves(Mock.TECHNICIAN_1);
        await TaskService.getInstance(service).get(Mock.REQUEST_ID, Mock.TECHNICIAN_1_ID, 10, 0, undefined, Mock.TECHNICIAN_2_ID);
      } catch (error) {
        expect(error).to.be.deep.equal(ErrorUtils.createApiError(Mock.REQUEST_ID, HttpErrorCode.HTTP_403_Forbidden, ApiForbiddenErrors.CannotPerformOperation));
      }
    });

    it('should throw UNABLE_TO_DETERMINE_ROLE error', async () => {
      try {
        sandbox.stub(UserFacade.getInstance(service), 'getById').resolves(Mock.RANDOM_USER);
        await TaskService.getInstance(service).get(Mock.REQUEST_ID, Mock.TECHNICIAN_1_ID, 10, 0, undefined);
      } catch (error) {
        expect(error).to.be.deep.equal(ErrorUtils.createApiError(Mock.REQUEST_ID, HttpErrorCode.HTTP_403_Forbidden, ApiForbiddenErrors.UnableToDetermineRole));
      }
    });

    it('should resolve', async () => {
      sandbox.stub(UserFacade.getInstance(service), 'getById').resolves(Mock.MANAGER_USER_1);
      sandbox.stub(TaskFacade.getInstance(service), 'get').resolves(getPaginatedResponse<TaskModel>([Mock.TASK_1]));

      const result = await TaskService.getInstance(service).get(Mock.REQUEST_ID, Mock.MANAGER_USER_1_ID, 10, 0);

      expect(result).to.be.deep.equal(getPaginatedResponse<TaskModel>([Mock.TASK_1]));
    });
  });
});
