import { Not, Repository } from 'typeorm';
import { PaginatedResponse } from '../../@types/paginated-response';
import { BaseFacade } from '../../base/base-facade';
import { AppDatabaseErrors, AppSingletonErrors } from '../../errors/generic/app-errors';
import { TaskModel } from '../../models/task-model';
import { SwordHealthBackendChallengeService } from '../../sword-health-backend-challenge-service';
import { ErrorUtils } from '../../utils/error-utils';
import { TypeUtils } from '../../utils/type-utils';
import { TaskStatus } from '../@types/task-status';
import { TaskEntity } from '../entities/task-entity';

export class TaskFacade extends BaseFacade {
  private static instance?: TaskFacade;

  private taskRepository!: Repository<TaskEntity>;

  private constructor(service: SwordHealthBackendChallengeService) {
    super(service);
  }

  static getInstance(service?: SwordHealthBackendChallengeService): TaskFacade {
    if (this.instance) {
      return this.instance;
    }
    if (!service) {
      throw ErrorUtils.createApplicationError(AppSingletonErrors.ServiceNotDefined);
    }
    this.instance = new TaskFacade(service);
    return this.instance;
  }

  initRepositories(): void {
    if (this.taskRepository) {
      return;
    }

    if (!this.dataSource.isInitialized) {
      throw ErrorUtils.createApplicationError(AppDatabaseErrors.NotConfigured);
    }

    this.taskRepository = this.dataSource.getRepository(TaskEntity);
  }

  async get(requestId: UUID, limit: number, skip: number, status?: TaskStatus, technicianId?: UUID): Promise<PaginatedResponse<TaskModel>> {
    this.initRepositories();
    this.logger.info({ requestId, limit, skip }, 'TaskFacade: get');

    const [result, total] = await this.taskRepository.findAndCount({
      relations: {
        manager: true,
        technician: true,
      },
      where: {
        status: status ?? Not(TaskStatus.ARCHIVED),
        technicianId,
      },
      order: {
        createdAt: 'DESC',
      },
      skip,
      take: limit,
    });
    this.logger.debug({ requestId, result, total }, 'create: result, total');

    return { result: result.map((e) => TaskModel.fromEntity(e)), total };
  }

  async create(requestId: UUID, summary: string, managerId: UUID, technicianId: UUID): Promise<TaskModel> {
    this.initRepositories();
    this.logger.info({ requestId, summary, managerId, technicianId }, 'TaskFacade: create');

    const insertedResult = await this.taskRepository.insert({
      summary,
      managerId,
      technicianId,
    });
    this.logger.debug({ requestId, insertedResult }, 'create: insertedResult');

    const { id } = insertedResult.identifiers[0];
    TypeUtils.assertUUID(id);

    const result = await this.taskRepository.findOneOrFail({
      relations: {
        manager: true,
        technician: true,
      },
      where: {
        id,
      },
    });
    this.logger.debug({ requestId, result }, 'create: result');

    return TaskModel.fromEntity(result);
  }

  async getById(requestId: UUID, id: string): Promise<TaskModel | undefined> {
    this.initRepositories();
    this.logger.info({ requestId, id }, 'TaskFacade: getById');

    const result = await this.taskRepository.findOne({
      relations: {
        manager: true,
        technician: true,
      },
      where: {
        id,
        status: Not(TaskStatus.ARCHIVED),
      },
    });
    this.logger.debug({ requestId, result }, 'getById: result');

    return result ? TaskModel.fromEntity(result) : undefined;
  }
}
