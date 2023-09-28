import { Repository } from 'typeorm';
import { BaseFacade } from '../../base/base-facade';
import { AppDatabaseErrors, AppSingletonErrors } from '../../errors/generic/app-errors';
import { SwordHealthBackendChallengeService } from '../../sword-health-backend-challenge-service';
import { ErrorUtils } from '../../utils/error-utils';
import { UserEntity } from '../entities/user-entity';

export class UserFacade extends BaseFacade<SwordHealthBackendChallengeService> {
  private static instance?: UserFacade;

  private userRepository!: Repository<UserEntity>;

  private constructor(service: SwordHealthBackendChallengeService) {
    super(service);
  }

  static getInstance(service?: SwordHealthBackendChallengeService): UserFacade {
    if (this.instance) {
      return this.instance;
    }
    if (!service) {
      throw ErrorUtils.createApplicationError(AppSingletonErrors.ServiceNotDefined);
    }
    this.instance = new UserFacade(service);
    return this.instance;
  }

  initRepositories(): void {
    if (this.userRepository) {
      return;
    }

    if (!this.service || !this.service.getDataSource) {
      throw ErrorUtils.createApplicationError(AppDatabaseErrors.NotConfigured);
    }

    this.userRepository = this.service.getDataSource.getRepository(UserEntity);
  }

  async get(requestId: UUID): Promise<UserEntity[]> {
    this.initRepositories();

    this.logger.info({ requestId }, 'UserFacade: get');

    const result = await this.userRepository.find();
    this.logger.debug({ result }, 'get: result');

    return result;
  }
}
