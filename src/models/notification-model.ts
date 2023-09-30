import { NotificationMetadata } from '../@types/api/notification';
import { NotificationType } from '../db/@types/notification-type';
import { NotificationEntity } from '../db/entities/notification-entity';
import { TypeUtils } from '../utils/type-utils';

export class NotificationModel {
  id: UUID;

  type: NotificationType;

  toUserId: UUID;

  metadata?: NotificationMetadata;

  isRead: boolean;

  createdAt: Date;

  constructor(id: UUID, type: NotificationType, toUserId: UUID, metadata: object, isRead: boolean, createadAt: Date) {
    this.id = id;
    this.type = type;
    this.toUserId = toUserId;
    this.isRead = isRead;
    this.createdAt = createadAt;
    if (TypeUtils.isNotificationMetadata(metadata)) {
      this.metadata = metadata;
    }
  }

  static fromEntity(entity: NotificationEntity): NotificationModel {
    return new NotificationModel(entity.id, entity.type, entity.toUserId, entity.metadata, entity.isRead, entity.createdAt);
  }
}
