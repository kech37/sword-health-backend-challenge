import { NotificationResponse } from './notification-response';

export interface GetNotificationsResponse {
  result: NotificationResponse[];
  total: number;
}
