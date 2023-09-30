import { TaskStatus } from '../../db/@types/task-status';

export interface UpdateTaskRequestBody {
  summary?: string;
  status?: TaskStatus;
}
