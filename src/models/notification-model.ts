import { NotificationType } from '../db/@types/notification-type';
import { NotificationEntity } from '../db/entities/notification-entity';

export class NotificationModel {
  id: UUID;

  type: NotificationType;

  toUserId: UUID;

  // metadata: Object;

  isRead: boolean;

  createdAt: Date;

  constructor(id: UUID, type: NotificationType, toUserId: UUID, isRead: boolean, createadAt: Date) {
    this.id = id;
    this.type = type;
    this.toUserId = toUserId;
    this.isRead = isRead;
    this.createdAt = createadAt;
  }

  static fromEntity(entity: NotificationEntity): NotificationModel {
    return new NotificationModel(entity.id, entity.type, entity.toUserId, entity.isRead, entity.createdAt);
  }
}
