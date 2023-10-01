import { PaginatedResponse } from '../@types/paginated-response';

export class TestUtils {
  static getPaginatedResponse<T>(result: T[]): PaginatedResponse<T> {
    return {
      result,
      total: result.length,
    };
  }
}
