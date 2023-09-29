/// <reference types='../../@types/global' />
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { NotificationType } from '../@types/notification-type';
import { UserEntity } from './user-entity';

@Entity('notification', { schema: 'public' })
export class NotificationEntity extends BaseEntity {
  @Column('uuid', {
    primary: true,
    name: 'id',
    default: () => '(UUID())',
  })
  id!: UUID;

  @Column('enum', {
    name: 'status',
    enum: NotificationType,
    nullable: false,
  })
  type!: NotificationType;

  @Column('uuid', {
    name: 'to_user_id',
    nullable: false,
  })
  toUserId!: UUID;

  @Column('json', {
    name: 'metadata',
    nullable: false,
  })
  metadata!: object;

  @Column('datetime', {
    name: 'created_at',
    default: () => '(NOW())',
    nullable: false,
  })
  createdAt!: Date;

  @ManyToOne(() => UserEntity, (entity) => entity.id)
  @JoinColumn({ name: 'to_user_id' })
  toUser!: UserEntity | null;
}
