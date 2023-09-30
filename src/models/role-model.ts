import { CRUD } from '../@types/crud';
import { UserRole } from '../db/@types/user-role';
import { RoleEntity } from '../db/entities/role-entity';

export class RoleModel {
  name: UserRole;

  ownPermission: CRUD;

  globalPermission: CRUD;

  constructor(name: UserRole, ownPermission: CRUD, globalPermission: CRUD) {
    this.name = name;
    this.ownPermission = ownPermission;
    this.globalPermission = globalPermission;
  }

  static fromEntity(entity: RoleEntity): RoleModel {
    return new RoleModel(
      entity.name,
      {
        canCreate: entity.canOwnCreate,
        canRead: entity.canOwnRead,
        canUpdate: entity.canOwnUpdate,
        canDelete: entity.canOwnDelete,
      },
      {
        canCreate: entity.canGlobalCreate,
        canRead: entity.canGlobalRead,
        canUpdate: entity.canGlobalUpdate,
        canDelete: entity.canGlobalDelete,
      },
    );
  }
}
