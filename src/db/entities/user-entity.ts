import { BaseEntity, Column, Entity } from 'typeorm';
import { UserRole } from '../@types/user-role';

@Entity('user', { schema: 'public' })
export class UserEntity extends BaseEntity {
  @Column('uuid', {
    primary: true,
    name: 'id',
    default: () => '(UUID())',
  })
  id!: string;

  @Column('enum', {
    name: 'role',
    enum: UserRole,
  })
  role!: UserRole;
}
