import { NotificationType } from '../db/@types/notification-type';
import { TaskStatus } from '../db/@types/task-status';
import { UserRole } from '../db/@types/user-role';
import { NotificationModel } from '../models/notification-model';
import { RoleModel } from '../models/role-model';
import { TaskModel } from '../models/task-model';
import { UserModel } from '../models/user-model';

export class Mock {
  static REQUEST_ID = 'f50320bd-d0aa-4a5a-9468-cb7cf58d4ad4';

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
    '70c1f023-0588-41e0-b695-fa3bd33b6977',
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

  static MANAGER_USER_1 = new UserModel('fa634d9f-7a47-4efb-b432-812d2b449dd5', 'MANAGER #1', Mock.MANAGER_ROLE);

  static MANAGER_USER_2 = new UserModel('31afbafc-bd8f-47c4-bd37-3e6e22f02da2', 'MANAGER #2', Mock.MANAGER_ROLE);

  static TECHNICIAN_1 = new UserModel('41f71b67-a18c-4374-87a4-b2ed044fdbde', 'TECHNICIAN #1', Mock.TECHNICIAN_ROLE);

  static TECHNICIAN_2 = new UserModel('88686182-9b18-4556-b4bf-664a82bf06e5', 'TECHNICIAN #2', Mock.TECHNICIAN_ROLE);

  static TASK_1 = new TaskModel(
    '5274e6ba-2c52-497a-a52f-ce7dcbf95fce',
    'summary from TASK 1',
    TaskStatus.NEW,
    Mock.MANAGER_USER_1.id,
    Mock.TECHNICIAN_1.id,
    new Date(),
    new Date(),
    undefined,
    Mock.MANAGER_USER_1,
    Mock.TECHNICIAN_1,
  );

  static NOTIFICATION = new NotificationModel(
    'fb55cc43-ed70-4447-9cb8-c8531a862271',
    NotificationType.TASK_COMPLETED,
    Mock.MANAGER_USER_1.id,
    { taskId: Mock.TASK_1.id },
    false,
    new Date(),
  );
}
