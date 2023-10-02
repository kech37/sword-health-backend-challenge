import { In, Not, Repository } from 'typeorm';
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

    const result = await this.dataSource.transaction(async (em) => {
      const rep = em.getRepository(TaskEntity);

      const insertedTask = await rep.insert({
        summary,
        managerId,
        technicianId,
      });
      this.logger.debug({ requestId, insertedTask }, 'create: insertedTask');

      const { id } = insertedTask.identifiers[0];
      TypeUtils.assertUUID(id);

      const task = await rep.findOneOrFail({
        relations: {
          manager: true,
          technician: true,
        },
        where: {
          id,
        },
      });
      this.logger.debug({ requestId, task }, 'create: task');

      return task;
    });

    return TaskModel.fromEntity(result);
  }

  async getById(requestId: UUID, id: UUID, includeArchived = false): Promise<TaskModel | undefined> {
    this.initRepositories();
    this.logger.info({ requestId, id }, 'TaskFacade: getById');

    const result = await this.taskRepository.findOne({
      relations: {
        manager: true,
        technician: true,
      },
      where: {
        id,
        status: !includeArchived ? Not(TaskStatus.ARCHIVED) : undefined,
      },
    });
    this.logger.debug({ requestId, result }, 'getById: result');

    return result ? TaskModel.fromEntity(result) : undefined;
  }

  async update(requestId: UUID, id: UUID, status?: TaskStatus, summary?: string): Promise<TaskModel> {
    this.initRepositories();
    this.logger.info({ requestId, id }, 'TaskFacade: update');

    const result = await this.dataSource.transaction(async (em) => {
      const rep = em.getRepository(TaskEntity);

      const updateTask = await rep.update(
        {
          id,
        },
        {
          status,
          summary,
        },
      );
      this.logger.debug({ requestId, updateTask }, 'update: updateTask');

      const task = await rep.findOneOrFail({
        relations: {
          manager: true,
          technician: true,
        },
        where: {
          id,
        },
      });
      this.logger.debug({ requestId, task }, 'update: task');

      return task;
    });

    return TaskModel.fromEntity(result);
  }

  async delete(requestId: UUID, id: UUID): Promise<void> {
    this.initRepositories();
    this.logger.info({ requestId, id }, 'TaskFacade: delete');

    await this.taskRepository.delete({ id });
    this.logger.debug({ requestId }, 'TaskFacade: ok');
  }

  async getSet(requestId: UUID, ids: UUID[]): Promise<TaskModel[]> {
    this.initRepositories();
    this.logger.info({ requestId, ids }, 'TaskFacade: getSet');

    const result = await this.taskRepository.find({
      relations: {
        manager: true,
        technician: true,
      },
      where: {
        id: In(ids),
      },
    });
    this.logger.debug({ requestId, result }, 'getSet: result');

    return result.map((e) => TaskModel.fromEntity(e));
  }
}
