import { TaskStatus } from '../db/@types/task-status';
import { TaskEntity } from '../db/entities/task-entity';
import { UserModel } from './user-model';

export class TaskModel {
  id: UUID;

  summary: string;

  status: TaskStatus;

  managerId: UUID;

  technicianId: UUID;

  completedAt?: Date;

  createdAt: Date;

  updatedAt: Date;

  manager?: UserModel;

  technician?: UserModel;

  constructor(
    id: UUID,
    summary: string,
    status: TaskStatus,
    managerId: UUID,
    technicianId: UUID,
    createdAt: Date,
    updatedAt: Date,
    completedAt?: Date,
    manager?: UserModel,
    technician?: UserModel,
  ) {
    this.id = id;
    this.summary = summary;
    this.status = status;
    this.managerId = managerId;
    this.technicianId = technicianId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.completedAt = completedAt;
    this.manager = manager;
    this.technician = technician;
  }

  static fromEntity(entity: TaskEntity): TaskModel {
    return new TaskModel(
      entity.id,
      entity.summary,
      entity.status,
      entity.managerId,
      entity.technicianId,
      entity.createdAt,
      entity.updatedAt,
      entity.completedAt ?? undefined,
      entity.manager ? UserModel.fromEntity(entity.manager) : undefined,
      entity.technician ? UserModel.fromEntity(entity.technician) : undefined,
    );
  }
}
