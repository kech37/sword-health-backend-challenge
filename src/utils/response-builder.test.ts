import { expect } from 'chai';
import { GetNotificationsResponse } from '../@types/api/get-notifications-response';
import { NotificationResponse } from '../@types/api/notification-response';
import { Task } from '../@types/api/task';
import { TaskSummary } from '../@types/api/task-summary';
import { User } from '../@types/api/user';
import { PaginatedResponse } from '../@types/paginated-response';
import { Mock } from '../configs/mock';
import { AppResponseBuilderErrors } from '../errors/generic/app-errors';
import { ErrorUtils } from './error-utils';
import { ResponseBuilder } from './response-builder';

describe('Response builder', () => {
  it('toUser', () => {
    const result = ResponseBuilder.toUser(Mock.MANAGER_USER_1);
    const expectedResult: User = {
      id: Mock.MANAGER_USER_1.id,
      name: Mock.MANAGER_USER_1.name,
    };
    expect(result).to.be.deep.equal(expectedResult);
  });

  it('toGetTasksResponse', () => {
    const result = ResponseBuilder.toGetTasksResponse([Mock.TASK_1], 1);
    const expectedResult: PaginatedResponse<Task> = {
      result: [
        {
          id: Mock.TASK_1.id,
          status: Mock.TASK_1.status,
          summary: Mock.TASK_1.summary,
          manager: {
            id: Mock.MANAGER_USER_1.id,
            name: Mock.MANAGER_USER_1.name,
          },
          technician: {
            id: Mock.TECHNICIAN_1.id,
            name: Mock.TECHNICIAN_1.name,
          },
          createdAt: Mock.TASK_1.createdAt.toISOString(),
          completedAt: Mock.TASK_1.completedAt?.toISOString(),
        },
      ],
      total: 1,
    };
    expect(result).to.be.deep.equal(expectedResult);
  });

  it('toTaskSummary', () => {
    const result = ResponseBuilder.toTaskSummary(Mock.TASK_1);
    const expectedResult: TaskSummary = {
      id: Mock.TASK_1.id,
      status: Mock.TASK_1.status,
      summary: Mock.TASK_1.summary,
      createdAt: Mock.TASK_1.createdAt.toISOString(),
    };
    expect(result).to.be.deep.equal(expectedResult);
  });

  it('GetNotificationsResponse', () => {
    const result = ResponseBuilder.toGetNotificationsResponse([Mock.NOTIFICATION], [Mock.TASK_1], 1);
    const expectedResult: GetNotificationsResponse = {
      result: [
        {
          id: Mock.NOTIFICATION.id,
          type: Mock.NOTIFICATION.type,
          task: {
            id: Mock.TASK_1.id,
            status: Mock.TASK_1.status,
            summary: Mock.TASK_1.summary,
            createdAt: Mock.TASK_1.createdAt.toISOString(),
          },
          technician: {
            id: Mock.TECHNICIAN_1.id,
            name: Mock.TECHNICIAN_1.name,
          },
          createdAt: Mock.NOTIFICATION.createdAt.toISOString(),
          completedAt: Mock.NOTIFICATION.createdAt.toISOString(),
        },
      ],
      total: 1,
    };
    expect(result).to.be.deep.equal(expectedResult);
  });

  context('toTask', () => {
    it('should throw USER_NOT_LOADED error when manager not defined', () => {
      try {
        ResponseBuilder.toTask({ ...Mock.TASK_1, manager: undefined });
      } catch (error) {
        expect(error).to.be.deep.equal(ErrorUtils.createApplicationError(AppResponseBuilderErrors.UserNotDefined));
      }
    });

    it('should throw USER_NOT_LOADED error when technician not defined', () => {
      try {
        ResponseBuilder.toTask({ ...Mock.TASK_1, technician: undefined });
      } catch (error) {
        expect(error).to.be.deep.equal(ErrorUtils.createApplicationError(AppResponseBuilderErrors.UserNotDefined));
      }
    });

    it('should resolve', () => {
      const result = ResponseBuilder.toTask(Mock.TASK_1);
      const expectedResult: Task = {
        id: Mock.TASK_1.id,
        status: Mock.TASK_1.status,
        summary: Mock.TASK_1.summary,
        manager: {
          id: Mock.MANAGER_USER_1.id,
          name: Mock.MANAGER_USER_1.name,
        },
        technician: {
          id: Mock.TECHNICIAN_1.id,
          name: Mock.TECHNICIAN_1.name,
        },
        createdAt: Mock.TASK_1.createdAt.toISOString(),
        completedAt: Mock.TASK_1.completedAt?.toISOString(),
      };
      expect(result).to.be.deep.equal(expectedResult);
    });
  });

  context('toNotificationResponse', () => {
    it('should throw TASK_NOT_FOUND', () => {
      try {
        ResponseBuilder.toNotificationResponse(Mock.NOTIFICATION, []);
      } catch (error) {
        expect(error).to.be.deep.equal(ErrorUtils.createApplicationError(AppResponseBuilderErrors.TaskNotFound));
      }
    });

    it('should throw TASK_NOT_FOUND', () => {
      try {
        ResponseBuilder.toNotificationResponse(Mock.NOTIFICATION, [{ ...Mock.TASK_1, technician: undefined }]);
      } catch (error) {
        expect(error).to.be.deep.equal(ErrorUtils.createApplicationError(AppResponseBuilderErrors.UserNotDefined));
      }
    });

    it('should resolve', () => {
      const result = ResponseBuilder.toNotificationResponse(Mock.NOTIFICATION, [Mock.TASK_1]);
      const expectedResult: NotificationResponse = {
        id: Mock.NOTIFICATION.id,
        type: Mock.NOTIFICATION.type,
        task: {
          id: Mock.TASK_1.id,
          status: Mock.TASK_1.status,
          summary: Mock.TASK_1.summary,
          createdAt: Mock.TASK_1.createdAt.toISOString(),
        },
        technician: {
          id: Mock.TECHNICIAN_1.id,
          name: Mock.TECHNICIAN_1.name,
        },
        createdAt: Mock.NOTIFICATION.createdAt.toISOString(),
        completedAt: Mock.NOTIFICATION.createdAt.toISOString(),
      };
      expect(result).to.be.deep.equal(expectedResult);
    });
  });
});
