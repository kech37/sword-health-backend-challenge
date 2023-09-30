import { NotificationType } from '../../db/@types/notification-type';

export interface NotificationMetadata {
  taskId: UUID;
}

export interface Notification {
  id: UUID;
  type: NotificationType;
  toUserId: UUID;
  metadata: NotificationMetadata;
  isRead: boolean;
  createdAt: DateString;
}
