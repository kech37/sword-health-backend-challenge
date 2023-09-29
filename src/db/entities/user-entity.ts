/// <reference types='../../@types/global' />
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserRole } from '../@types/user-role';
import { RoleEntity } from './role-entity';

@Entity('user', { schema: 'public' })
export class UserEntity extends BaseEntity {
  @Column('uuid', {
    primary: true,
    name: 'id',
    default: () => '(UUID())',
  })
  id!: UUID;

  @Column('varchar', {
    name: 'name',
    length: 256,
    nullable: false,
  })
  name!: string;

  @Column('enum', {
    name: 'role_name',
    enum: UserRole,
    nullable: false,
  })
  roleName!: UserRole;

  @Column('datetime', {
    name: 'created_at',
    default: () => '(NOW())',
    nullable: false,
  })
  createdAt!: Date;

  @ManyToOne(() => RoleEntity, (entity) => entity.name)
  @JoinColumn({ name: 'role_name' })
  role!: RoleEntity | null;
}
