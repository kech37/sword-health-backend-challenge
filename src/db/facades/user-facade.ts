import { Repository } from 'typeorm';
import { BaseFacade } from '../../base/base-facade';
import { AppDatabaseErrors, AppSingletonErrors } from '../../errors/generic/app-errors';
import { UserModel } from '../../models/user-model';
import { SwordHealthBackendChallengeService } from '../../sword-health-backend-challenge-service';
import { ErrorUtils } from '../../utils/error-utils';
import { UserEntity } from '../entities/user-entity';

type GetByIdOptions = { load?: { role?: boolean } };

export class UserFacade extends BaseFacade {
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

    if (!this.dataSource.isInitialized) {
      throw ErrorUtils.createApplicationError(AppDatabaseErrors.NotConfigured);
    }

    this.userRepository = this.dataSource.getRepository(UserEntity);
  }

  async getById(requestId: UUID, id: UUID, options?: GetByIdOptions): Promise<UserModel | undefined> {
    this.initRepositories();

    this.logger.info({ requestId, id }, 'UserFacade: getById');

    const result = await this.userRepository.findOne({
      relations: {
        role: options?.load?.role,
      },
      where: {
        id,
      },
    });
    this.logger.debug({ result }, 'get: result');

    return result ? UserModel.fromEntity(result) : undefined;
  }

  async getManagers(requestId: UUID): Promise<UserModel[]> {
    this.initRepositories();

    this.logger.info({ requestId }, 'UserFacade: getManagers');

    const result = await this.userRepository.find({
      relations: {
        role: true,
      },
      where: {
        role: {
          canOwnCreate: true,
          canOwnRead: true,
          canOwnUpdate: true,
          canOwnDelete: true,
          canGlobalCreate: false,
          canGlobalRead: true,
          canGlobalUpdate: false,
          canGlobalDelete: true,
        },
      },
    });
    this.logger.debug({ requestId, result }, 'getManagers: result');

    return result.map((e) => UserModel.fromEntity(e));
  }
}
