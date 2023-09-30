import { Repository } from 'typeorm';
import { BaseFacade } from '../../base/base-facade';
import { AppDatabaseErrors, AppSingletonErrors } from '../../errors/generic/app-errors';
import { NotificationModel } from '../../models/notification-model';
import { TaskModel } from '../../models/task-model';
import { SwordHealthBackendChallengeService } from '../../sword-health-backend-challenge-service';
import { ErrorUtils } from '../../utils/error-utils';
import { TypeUtils } from '../../utils/type-utils';
import { NotificationType } from '../@types/notification-type';
import { NotificationEntity } from '../entities/notification-entity';

export class NotificationFacade extends BaseFacade {
  private static instance?: NotificationFacade;

  private notificationRepository!: Repository<NotificationEntity>;

  private constructor(service: SwordHealthBackendChallengeService) {
    super(service);
  }

  static getInstance(service?: SwordHealthBackendChallengeService): NotificationFacade {
    if (this.instance) {
      return this.instance;
    }
    if (!service) {
      throw ErrorUtils.createApplicationError(AppSingletonErrors.ServiceNotDefined);
    }
    this.instance = new NotificationFacade(service);
    return this.instance;
  }

  initRepositories(): void {
    if (this.notificationRepository) {
      return;
    }

    if (!this.dataSource.isInitialized) {
      throw ErrorUtils.createApplicationError(AppDatabaseErrors.NotConfigured);
    }

    this.notificationRepository = this.dataSource.getRepository(NotificationEntity);
  }

  async create(requestId: UUID, task: TaskModel): Promise<NotificationModel> {
    this.initRepositories();

    this.logger.info({ requestId }, 'NotificationFacade: create');

    const insertedResult = await this.notificationRepository.insert({
      type: NotificationType.TASK_COMPLETED,
      toUserId: task.managerId,
      metadata: task,
    });
    this.logger.debug({ requestId, insertedResult }, 'create: insertedResult');

    const { id } = insertedResult.identifiers[0];
    TypeUtils.assertUUID(id);

    const result = await this.notificationRepository.findOneOrFail({
      where: {
        id,
      },
    });
    this.logger.debug({ requestId, result }, 'create: result');

    return NotificationModel.fromEntity(result);
  }
}
