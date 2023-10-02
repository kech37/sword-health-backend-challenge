import { expect } from 'chai';
import { Mock } from '../configs/mock';
import { TaskStatus } from '../db/@types/task-status';
import { AppTypeCheckErrors } from '../errors/generic/app-errors';
import { ErrorUtils } from './error-utils';
import { TypeUtils } from './type-utils';

describe('Type utils', () => {
  context('assertions errors', () => {
    it('should throw VARIABLE_IS_NOT_A_STRING', () => {
      try {
        TypeUtils.assertString(0);
      } catch (error) {
        expect(error).to.be.deep.equal(ErrorUtils.createApplicationError(AppTypeCheckErrors.NotAString));
      }
    });

    it('should throw VARIABLE_IS_NOT_A_UUID', () => {
      try {
        TypeUtils.assertUUID('NOT A UUID');
      } catch (error) {
        expect(error).to.be.deep.equal(ErrorUtils.createApplicationError(AppTypeCheckErrors.NotAUUID));
      }
    });

    it('should throw VARIABLE_IS_NOT_A_VALID_JWT_PAYLOAD', () => {
      try {
        TypeUtils.assertJwtPayload({});
      } catch (error) {
        expect(error).to.be.deep.equal(ErrorUtils.createApplicationError(AppTypeCheckErrors.NotAValidJwtPayload));
      }
    });

    it('should throw NOT_A_VALID_NOTIFICATION', () => {
      try {
        TypeUtils.assertsNotification({});
      } catch (error) {
        expect(error).to.be.deep.equal(ErrorUtils.createApplicationError(AppTypeCheckErrors.NotAValidNotification));
      }
    });
  });

  context('valid assertions', () => {
    it('isCreateTaskRequestBody', () => {
      expect(
        TypeUtils.isCreateTaskRequestBody({
          summary: Mock.TASK_1.summary,
        }),
      ).to.be.equal(true);
      expect(
        TypeUtils.isCreateTaskRequestBody({
          summary: Mock.TASK_1.summary,
          managerId: Mock.TASK_1.managerId,
        }),
      ).to.be.equal(true);
      expect(
        TypeUtils.isCreateTaskRequestBody({
          summary: Mock.TASK_1.summary,
          technicianId: Mock.TASK_1.technicianId,
        }),
      ).to.be.equal(true);
      expect(TypeUtils.isCreateTaskRequestBody({})).to.be.equal(false);
    });

    it('isGetTaskByIdParams', () => {
      expect(
        TypeUtils.isGetTaskByIdParams({
          id: Mock.TASK_1.id,
        }),
      ).to.be.equal(true);
      expect(
        TypeUtils.isGetTaskByIdParams({
          id: 'NOT AN UUID',
        }),
      ).to.be.equal(false);
    });

    it('isStringNonNegativeInteger', () => {
      expect(TypeUtils.isStringNonNegativeInteger('021321')).to.be.equal(true);
      expect(TypeUtils.isStringNonNegativeInteger('921321')).to.be.equal(true);
      expect(TypeUtils.isStringNonNegativeInteger('dsa')).to.be.equal(false);
      expect(TypeUtils.isStringNonNegativeInteger('-021321')).to.be.equal(false);
      expect(TypeUtils.isStringNonNegativeInteger('0.2')).to.be.equal(false);
      expect(TypeUtils.isStringNonNegativeInteger('-1.2')).to.be.equal(false);
      expect(TypeUtils.isStringNonNegativeInteger('3.021321')).to.be.equal(false);
    });

    it('isTaskStatus', () => {
      Object.values<string>(TaskStatus).forEach((status) => expect(TypeUtils.isTaskStatus(status)).to.be.equal(true));
      expect(TypeUtils.isTaskStatus('SAD DSA ASD')).to.be.equal(false);
    });

    it('isUpdateTaskIdParams', () => {
      expect(
        TypeUtils.isUpdateTaskIdParams({
          id: Mock.TASK_1.id,
        }),
      ).to.be.equal(true);
      expect(
        TypeUtils.isUpdateTaskIdParams({
          id: 'NOT AN UUID',
        }),
      ).to.be.equal(false);
    });

    it('isUpdateTaskRequestBody', () => {
      expect(
        TypeUtils.isUpdateTaskRequestBody({
          summary: Mock.TASK_1.summary,
          status: Mock.TASK_1.status,
        }),
      ).to.be.equal(true);
      expect(
        TypeUtils.isUpdateTaskRequestBody({
          summary: Mock.TASK_1.summary,
        }),
      ).to.be.equal(true);
      expect(
        TypeUtils.isUpdateTaskRequestBody({
          status: Mock.TASK_1.status,
        }),
      ).to.be.equal(true);
    });

    it('isDeleteTaskByIdParams', () => {
      expect(
        TypeUtils.isDeleteTaskByIdParams({
          id: Mock.TASK_1.id,
        }),
      ).to.be.equal(true);
      expect(
        TypeUtils.isDeleteTaskByIdParams({
          id: 'NOT AN UUID',
        }),
      ).to.be.equal(false);
    });

    it('isNotificationMetadata', () => {
      expect(
        TypeUtils.isNotificationMetadata({
          taskId: Mock.TASK_1.id,
        }),
      ).to.be.equal(true);
      expect(
        TypeUtils.isNotificationMetadata({
          taskId: 'INVALID UUID',
        }),
      ).to.be.equal(false);
      expect(
        TypeUtils.isNotificationMetadata({
          id: Mock.TASK_1.id,
        }),
      ).to.be.equal(false);
    });

    it('isNotification', () => {
      expect(
        TypeUtils.isNotification({
          id: Mock.NOTIFICATION.id,
          type: Mock.NOTIFICATION.type,
          toUserId: Mock.NOTIFICATION.toUserId,
          metadata: Mock.NOTIFICATION.metadata,
          isRead: Mock.NOTIFICATION.isRead,
          createdAt: Mock.NOTIFICATION.createdAt.toISOString(),
        }),
      ).to.be.equal(true);
    });

    it('isUpdateNotificationByIdParams', () => {
      expect(
        TypeUtils.isUpdateNotificationByIdParams({
          id: Mock.NOTIFICATION.id,
        }),
      ).to.be.equal(true);
      expect(
        TypeUtils.isUpdateNotificationByIdParams({
          id: 'NOT AN UUID',
        }),
      ).to.be.equal(false);
    });

    it('isUpdateNotificationRequestBody', () => {
      expect(
        TypeUtils.isUpdateNotificationRequestBody({
          isRead: Mock.NOTIFICATION.isRead,
        }),
      ).to.be.equal(true);
      expect(
        TypeUtils.isUpdateNotificationRequestBody({
          isRead: 'true',
        }),
      ).to.be.equal(false);
    });

    it('isEmptyObject', () => {
      expect(TypeUtils.isEmptyObject({})).to.be.equal(true);
      expect(
        TypeUtils.isEmptyObject({
          test: 'test',
        }),
      ).to.be.equal(false);
    });

    it('isPaginatedRequestQuery', () => {
      expect(
        TypeUtils.isPaginatedRequestQuery({
          limit: '10',
          skip: '0',
        }),
      ).to.be.equal(true);
      expect(
        TypeUtils.isPaginatedRequestQuery({
          limit: '1.0',
          skip: '-1',
        }),
      ).to.be.equal(false);
      expect(
        TypeUtils.isPaginatedRequestQuery({
          limit: 10,
          skip: 0,
        }),
      ).to.be.equal(false);
    });

    it('isGetTasksRequestQuery', () => {
      expect(
        TypeUtils.isGetTasksRequestQuery({
          limit: '10',
          skip: '0',
          status: TaskStatus.NEW,
          technicianId: Mock.TECHNICIAN_1.id,
        }),
      ).to.be.equal(true);
      expect(
        TypeUtils.isGetTasksRequestQuery({
          limit: '10',
          skip: '0',
          status: TaskStatus.NEW,
        }),
      ).to.be.equal(true);
      expect(
        TypeUtils.isGetTasksRequestQuery({
          limit: '10',
          skip: '0',
        }),
      ).to.be.equal(true);
      expect(
        TypeUtils.isGetTasksRequestQuery({
          limit: '10',
        }),
      ).to.be.equal(true);
      expect(TypeUtils.isGetTasksRequestQuery({})).to.be.equal(true);
      expect(
        TypeUtils.isGetTasksRequestQuery({
          status: TaskStatus.ARCHIVED,
        }),
      ).to.be.equal(false);
    });
  });
});
