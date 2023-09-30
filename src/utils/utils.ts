import { RoleModel } from '../models/role-model';

export class Utils {
  static isManagerRole(role: RoleModel): boolean {
    return (
      role.ownPermission.canCreate &&
      role.ownPermission.canRead &&
      role.ownPermission.canUpdate &&
      role.ownPermission.canDelete &&
      !role.globalPermission.canCreate &&
      role.globalPermission.canRead &&
      !role.globalPermission.canUpdate &&
      role.globalPermission.canDelete
    );
  }

  static isTechnicianRole(role: RoleModel): boolean {
    return (
      role.ownPermission.canCreate &&
      role.ownPermission.canRead &&
      role.ownPermission.canUpdate &&
      !role.ownPermission.canDelete &&
      !role.globalPermission.canCreate &&
      !role.globalPermission.canRead &&
      !role.globalPermission.canUpdate &&
      !role.globalPermission.canDelete
    );
  }
}
