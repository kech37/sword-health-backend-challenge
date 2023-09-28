import { baseService } from '../..';
import { BaseFacade } from '../../base/base-facade';
import { SwordHealthBackendChallengeService } from '../../sword-health-backend-challenge-service';
import { UserEntity } from '../entities/user-entity';

export class UserFacade extends BaseFacade<SwordHealthBackendChallengeService> {
  private static instance?: UserFacade;

  private constructor(service: SwordHealthBackendChallengeService) {
    super(service);
  }

  static getInstace(): UserFacade {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new UserFacade(baseService);
    return this.instance;
  }

  async get(): Promise<UserEntity[]> {
    this.logger.info('UserFacade: get');
    const userRep = this.service.getDataSource.getRepository(UserEntity);

    const result = await userRep.find();
    this.logger.debug({ result }, 'get: result');

    return result;
  }
}
