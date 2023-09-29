/// <reference types='../../@types/global' />
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EncryptionTransformer } from 'typeorm-encrypted';
import { DatabaseEncryptionTransformerConfig } from '../../configs/database-encryption-transformer-config';
import { TaskStatus } from '../@types/task-status';
import { UserEntity } from './user-entity';

@Entity('task', { schema: 'public' })
export class TaskEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  id!: UUID;

  @Column('varchar', {
    name: 'summary',
    length: 2500,
    transformer: new EncryptionTransformer(DatabaseEncryptionTransformerConfig),
    nullable: false,
  })
  summary!: string;

  @Column('datetime', {
    name: 'completed_at',
    nullable: true,
  })
  completedAt!: Date | null;

  @Column('enum', {
    name: 'status',
    enum: TaskStatus,
    nullable: false,
  })
  status!: TaskStatus;

  @Column('uuid', {
    name: 'technician_id',
    nullable: false,
  })
  technicianId!: UUID;

  @Column('uuid', {
    name: 'manager_id',
    nullable: false,
  })
  managerId!: UUID;

  @Column('datetime', {
    name: 'created_at',
    default: () => '(NOW())',
    nullable: false,
  })
  createdAt!: Date;

  @Column('datetime', {
    name: 'updated_at',
    default: () => '(NOW())',
    nullable: false,
  })
  updatedAt!: Date;

  @ManyToOne(() => UserEntity, (entity) => entity.id)
  @JoinColumn({ name: 'technician_id' })
  technician!: UserEntity | null;

  @ManyToOne(() => UserEntity, (entity) => entity.id)
  @JoinColumn({ name: 'manager_id' })
  manager!: UserEntity | null;
}
