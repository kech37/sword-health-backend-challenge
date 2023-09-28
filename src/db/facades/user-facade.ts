import { DataSource } from 'typeorm';
import { BaseFacade } from '../../base/base-facade';
import { SwordHealthBackendChallengeService } from '../../sword-health-backend-challenge-service';
import { UserEntity } from '../entities/user-entity';

export class UserFacade extends BaseFacade<SwordHealthBackendChallengeService> {
  private readonly dataSource: DataSource;

  constructor(service: SwordHealthBackendChallengeService) {
    super(service);
    this.dataSource = service.getDataSource;
  }

  async get(requestId: UUID): Promise<UserEntity[]> {
    this.logger.info({ requestId }, 'UserFacade: get');
    const userRep = this.dataSource.getRepository(UserEntity);

    const result = await userRep.find();
    this.logger.debug({ result }, 'get: result');

    return result;
  }
}
