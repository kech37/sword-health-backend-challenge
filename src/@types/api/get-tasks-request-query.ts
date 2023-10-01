import { TaskStatus } from '../../db/@types/task-status';
import { PaginatedRequestQuery } from './paginated-request-query';

export interface GetTasksRequestQuery extends PaginatedRequestQuery {
  ['status']?: TaskStatus;
  ['technicianId']?: UUID;
}
