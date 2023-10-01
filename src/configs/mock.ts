import { TaskStatus } from '../db/@types/task-status';
import { UserRole } from '../db/@types/user-role';
import { RoleModel } from '../models/role-model';
import { TaskModel } from '../models/task-model';
import { UserModel } from '../models/user-model';

export class Mock {
  static REQUEST_ID = 'REQUEST_ID';

  static MANAGER_ROLE = new RoleModel(
    UserRole.MANAGER,
    {
      canCreate: true,
      canRead: true,
      canUpdate: true,
      canDelete: true,
    },
    {
      canCreate: false,
      canRead: true,
      canUpdate: false,
      canDelete: true,
    },
  );

  static TECHNICIAN_ROLE = new RoleModel(
    UserRole.TECHNICIAN,
    {
      canCreate: true,
      canRead: true,
      canUpdate: true,
      canDelete: false,
    },
    {
      canCreate: false,
      canRead: false,
      canUpdate: false,
      canDelete: false,
    },
  );

  static RANDOM_USER = new UserModel(
    'RANDOM_USER_ID',
    'RANDOM_USER',
    new RoleModel(
      'RANDOM ROLE' as UserRole,
      {
        canCreate: false,
        canRead: false,
        canUpdate: false,
        canDelete: true,
      },
      {
        canCreate: true,
        canRead: false,
        canUpdate: true,
        canDelete: false,
      },
    ),
  );

  static MANAGER_USER_1_ID = 'MANAGER_USER_1_ID';

  static MANAGER_USER_1 = new UserModel(Mock.MANAGER_USER_1_ID, 'MANAGER #1', Mock.MANAGER_ROLE);

  static TECHNICIAN_1_ID = 'TECHNICIAN_1_ID';

  static TECHNICIAN_1 = new UserModel(Mock.TECHNICIAN_1_ID, 'TECHNICIAN #1', Mock.TECHNICIAN_ROLE);

  static TECHNICIAN_2_ID = 'TECHNICIAN_2_ID';

  static TECHNICIAN_2 = new UserModel(Mock.TECHNICIAN_2_ID, 'TECHNICIAN #2', Mock.TECHNICIAN_ROLE);

  static TASK_1 = new TaskModel(
    'TASK_1_ID',
    'summary from TASK 1',
    TaskStatus.NEW,
    Mock.MANAGER_USER_1_ID,
    Mock.TECHNICIAN_1_ID,
    new Date(),
    new Date(),
    undefined,
    Mock.MANAGER_USER_1,
    Mock.TECHNICIAN_1,
  );
}
