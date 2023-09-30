import { UserEntity } from '../db/entities/user-entity';
import { RoleModel } from './role-model';

export class UserModel {
  id: UUID;

  name: string;

  role?: RoleModel;

  constructor(id: UUID, name: string, role?: RoleModel) {
    this.id = id;
    this.name = name;
    this.role = role;
  }

  static fromEntity(entity: UserEntity): UserModel {
    return new UserModel(entity.id, entity.name, entity.role ? RoleModel.fromEntity(entity.role) : undefined);
  }
}
