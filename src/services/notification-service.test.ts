import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { HttpErrorCode } from '../@types/http-error-code';
import { LogLevel } from '../@types/log-level';
import { Mock } from '../configs/mock';
import { NotificationFacade } from '../db/facades/notification-facade';
import { TaskFacade } from '../db/facades/task-facade';
import { UserFacade } from '../db/facades/user-facade';
import { ApiForbiddenErrors, ApiNotFoundErrors } from '../errors/generic/api-errors';
import { AppSingletonErrors, AppTypeCheckErrors } from '../errors/generic/app-errors';
import { ApplicationError } from '../errors/models/application-error';
import { NotificationModel } from '../models/notification-model';
import { SwordHealthBackendChallengeService } from '../sword-health-backend-challenge-service';
import { ErrorUtils } from '../utils/error-utils';
import { TestUtils } from '../utils/test-utils';
import { NotificationService } from './notification-service';

describe('Notificaion service', () => {
  const service = new SwordHealthBackendChallengeService(LogLevel.SILENT);

  const sandbox = createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  context('instance', () => {
    it('should throw SERVICE_NOT_DEFINED error', () => {
      const error = expect(() => {
        NotificationService.getInstance();
      }).to.throw(ApplicationError);

      error.that.has.property('message', AppSingletonErrors.ServiceNotDefined.description);
      error.that.has.property('errorCode', AppSingletonErrors.ServiceNotDefined.code);
    });
  });

  context('get', () => {
    it('should throw CANNONT_PERFORM_OPERATION error', async () => {
      try {
        sandbox.stub(UserFacade.getInstance(service), 'getById').resolves(Mock.TECHNICIAN_1);

        await NotificationService.getInstance(service).get(Mock.REQUEST_ID, Mock.TECHNICIAN_1.id, 10, 0);
      } catch (error) {
        expect(error).to.be.deep.equal(ErrorUtils.createApiError(Mock.REQUEST_ID, HttpErrorCode.HTTP_403_Forbidden, ApiForbiddenErrors.CannotPerformOperation));
      }
    });

    it('should resolve', async () => {
      sandbox.stub(UserFacade.getInstance(service), 'getById').resolves(Mock.MANAGER_USER_1);
      sandbox.stub(NotificationFacade.getInstance(service), 'get').resolves(TestUtils.getPaginatedResponse<NotificationModel>([Mock.NOTIFICATION]));
      sandbox.stub(TaskFacade.getInstance(service), 'getSet').resolves([Mock.TASK_1]);

      const result = await NotificationService.getInstance(service).get(Mock.REQUEST_ID, Mock.MANAGER_USER_1.id, 10, 0);
      expect(result).to.be.deep.equal([TestUtils.getPaginatedResponse<NotificationModel>([Mock.NOTIFICATION]), [Mock.TASK_1]]);
    });
  });

  context('update', () => {
    it('should throw CANNONT_PERFORM_OPERATION error', async () => {
      try {
        sandbox.stub(UserFacade.getInstance(service), 'getById').resolves(Mock.TECHNICIAN_1);

        await NotificationService.getInstance(service).update(Mock.REQUEST_ID, Mock.TECHNICIAN_1.id, Mock.NOTIFICATION.id, true);
      } catch (error) {
        expect(error).to.be.deep.equal(ErrorUtils.createApiError(Mock.REQUEST_ID, HttpErrorCode.HTTP_403_Forbidden, ApiForbiddenErrors.CannotPerformOperation));
      }
    });

    it('should throw UNABLE_TO_DETERMINE_ROLE error', async () => {
      try {
        sandbox.stub(UserFacade.getInstance(service), 'getById').resolves(Mock.RANDOM_USER);

        await NotificationService.getInstance(service).update(Mock.REQUEST_ID, Mock.RANDOM_USER.id, Mock.NOTIFICATION.id, true);
      } catch (error) {
        expect(error).to.be.deep.equal(ErrorUtils.createApiError(Mock.REQUEST_ID, HttpErrorCode.HTTP_403_Forbidden, ApiForbiddenErrors.UnableToDetermineRole));
      }
    });

    it('should throw UNABLE_TO_DETERMINE_ROLE error', async () => {
      try {
        sandbox.stub(UserFacade.getInstance(service), 'getById').resolves(Mock.MANAGER_USER_1);
        sandbox.stub(NotificationFacade.getInstance(service), 'getById').resolves(undefined);

        await NotificationService.getInstance(service).update(Mock.REQUEST_ID, Mock.MANAGER_USER_1.id, 'INVALID ID', true);
      } catch (error) {
        expect(error).to.be.deep.equal(ErrorUtils.createApiError(Mock.REQUEST_ID, HttpErrorCode.HTTP_404_NotFound, ApiNotFoundErrors.NotificationNotFound));
      }
    });

    it('should throw CANNONT_PERFORM_OPERATION error when the user tries to update a notification that is not directed to them', async () => {
      try {
        sandbox.stub(UserFacade.getInstance(service), 'getById').resolves(Mock.MANAGER_USER_2);
        sandbox.stub(NotificationFacade.getInstance(service), 'getById').resolves(Mock.NOTIFICATION);

        await NotificationService.getInstance(service).update(Mock.REQUEST_ID, Mock.MANAGER_USER_2.id, Mock.NOTIFICATION.id, true);
      } catch (error) {
        expect(error).to.be.deep.equal(ErrorUtils.createApiError(Mock.REQUEST_ID, HttpErrorCode.HTTP_403_Forbidden, ApiForbiddenErrors.CannotPerformOperation));
      }
    });

    it('should throw NOT_DEFINED error', async () => {
      try {
        sandbox.stub(UserFacade.getInstance(service), 'getById').resolves(Mock.MANAGER_USER_1);
        sandbox.stub(NotificationFacade.getInstance(service), 'getById').resolves({ ...Mock.NOTIFICATION, metadata: undefined });
        sandbox.stub(NotificationFacade.getInstance(service), 'update').resolves({ ...Mock.NOTIFICATION, metadata: undefined });

        await NotificationService.getInstance(service).update(Mock.REQUEST_ID, Mock.MANAGER_USER_1.id, Mock.NOTIFICATION.id, true);
      } catch (error) {
        expect(error).to.be.deep.equal(ErrorUtils.createApplicationError(AppTypeCheckErrors.NotDefined));
      }
    });

    it('should throw TASK_NOT_FOUND error', async () => {
      try {
        sandbox.stub(UserFacade.getInstance(service), 'getById').resolves(Mock.MANAGER_USER_1);
        sandbox.stub(NotificationFacade.getInstance(service), 'getById').resolves(Mock.NOTIFICATION);
        sandbox.stub(NotificationFacade.getInstance(service), 'update').resolves({ ...Mock.NOTIFICATION, isRead: true });
        sandbox.stub(TaskFacade.getInstance(service), 'getById').resolves(undefined);

        await NotificationService.getInstance(service).update(Mock.REQUEST_ID, Mock.MANAGER_USER_1.id, Mock.NOTIFICATION.id, true);
      } catch (error) {
        expect(error).to.be.deep.equal(ErrorUtils.createApiError(Mock.REQUEST_ID, HttpErrorCode.HTTP_404_NotFound, ApiNotFoundErrors.TaskNotFound));
      }
    });

    it('should resolve', async () => {
      sandbox.stub(UserFacade.getInstance(service), 'getById').resolves(Mock.MANAGER_USER_1);
      sandbox.stub(NotificationFacade.getInstance(service), 'getById').resolves(Mock.NOTIFICATION);
      sandbox.stub(NotificationFacade.getInstance(service), 'update').resolves({ ...Mock.NOTIFICATION, isRead: true });
      sandbox.stub(TaskFacade.getInstance(service), 'getById').resolves(Mock.TASK_1);

      const result = await NotificationService.getInstance(service).update(Mock.REQUEST_ID, Mock.MANAGER_USER_1.id, Mock.NOTIFICATION.id, true);
      expect(result).to.be.deep.equal([{ ...Mock.NOTIFICATION, isRead: true }, Mock.TASK_1]);
    });
  });
});
