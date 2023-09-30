import { NotificationType } from '../db/@types/notification-type';
import { NotificationEntity } from '../db/entities/notification-entity';

export class NotificationModel {
  id: UUID;

  type: NotificationType;

  toUserId: UUID;

  metadata: object;

  isRead: boolean;

  createdAt: Date;

  constructor(id: UUID, type: NotificationType, toUserId: UUID, metadata: object, isRead: boolean, createadAt: Date) {
    this.id = id;
    this.type = type;
    this.toUserId = toUserId;
    this.metadata = metadata;
    this.isRead = isRead;
    this.createdAt = createadAt;
  }

  static fromEntity(entity: NotificationEntity): NotificationModel {
    return new NotificationModel(entity.id, entity.type, entity.toUserId, entity.metadata, entity.isRead, entity.createdAt);
  }
}
