import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { UserRole } from '../@types/user-role';

@Entity('role', { schema: 'public' })
export class RoleEntity extends BaseEntity {
  @PrimaryColumn('enum', {
    name: 'name',
    enum: UserRole,
  })
  name!: UserRole;

  @Column('boolean', {
    name: 'can_own_create',
    nullable: false,
  })
  canOwnCreate!: boolean;

  @Column('boolean', {
    name: 'can_own_read',
    nullable: false,
  })
  canOwnRead!: boolean;

  @Column('boolean', {
    name: 'can_own_update',
    nullable: false,
  })
  canOwnUpdate!: boolean;

  @Column('boolean', {
    name: 'can_own_delete',
    nullable: false,
  })
  canOwnDelete!: boolean;

  @Column('boolean', {
    name: 'can_global_create',
    nullable: false,
  })
  canGlobalCreate!: boolean;

  @Column('boolean', {
    name: 'can_global_read',
    nullable: false,
  })
  canGlobalRead!: boolean;

  @Column('boolean', {
    name: 'can_global_update',
    nullable: false,
  })
  canGlobalUpdate!: boolean;

  @Column('boolean', {
    name: 'can_global_delete',
    nullable: false,
  })
  canGlobalDelete!: boolean;
}
