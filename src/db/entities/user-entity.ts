/// <reference types='../../@types/global' />
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../@types/user-role';
import { RoleEntity } from './role-entity';

@Entity('user', { schema: 'public' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
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
