import { TaskStatus } from '../../db/@types/task-status';
import { User } from './user';

export interface Task {
  id: UUID;
  status: TaskStatus;
  summary: string;
  manager: User;
  technician: User;
  createdAt: DateString;
  completedAt?: DateString;
}
