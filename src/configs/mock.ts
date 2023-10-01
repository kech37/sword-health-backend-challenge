import { TaskStatus } from '../db/@types/task-status';
import { UserRole } from '../db/@types/user-role';
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

  static MANAGER_USER_1 = new UserModel('f544491c-17cf-406e-a6c6-3a81a7aa9bd9', 'MANAGER #1', Mock.MANAGER_ROLE);

  static MANAGER_USER_2 = new UserModel('99e241a2-fe84-445e-afc2-22db50cd35de', 'MANAGER #2', Mock.MANAGER_ROLE);

  static TECHNICIAN_1 = new UserModel('470bdc41-ad68-45fa-9fb0-78f16e07792f', 'TECHNICIAN #1', Mock.TECHNICIAN_ROLE);

  static TECHNICIAN_2 = new UserModel('487728ba-8a8a-4383-89d9-7e1593dc69ad', 'TECHNICIAN #2', Mock.TECHNICIAN_ROLE);

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
}
