import { expect } from 'chai';
import { AppSingletonErrors } from '../errors/generic/app-errors';
import { ApplicationError } from '../errors/models/application-error';
import { SwordHealthBackendChallengeService } from '../sword-health-backend-challenge-service';
import { TaskService } from './task-service';

describe('Task service', () => {
  context('instance', () => {
    const service = new SwordHealthBackendChallengeService();

    it('should throw service not defined error', () => {
      const result = expect(() => {
        TaskService.getInstance();
      }).to.throw(ApplicationError);

      result.that.has.property('message', AppSingletonErrors.ServiceNotDefined.description);
      result.that.has.property('errorCode', AppSingletonErrors.ServiceNotDefined.code);
    });

    it('should not throw service not defined error', () => {
      expect(() => {
        TaskService.getInstance(service);
      }).not.to.throw(ApplicationError);
    });
  });
});
