import { TaskStatus } from '../../db/@types/task-status';

export interface TaskSummary {
  id: UUID;
  status: TaskStatus;
  summary: string;
  createdAt: DateString;
}
