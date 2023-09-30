import { NotificationType } from '../../db/@types/notification-type';
import { TaskSummary } from './task-summary';
import { User } from './user';

export interface NotificationResponse {
  id: UUID;
  type: NotificationType;
  task: TaskSummary;
  technician: User;
  createdAt: DateString;
  completedAt: DateString;
}
