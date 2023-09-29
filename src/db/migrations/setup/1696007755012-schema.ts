import { MigrationInterface, QueryRunner } from 'typeorm';

export class Schema1696007755012 implements MigrationInterface {
  name = 'Schema1696007755012';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE \`role\` (
                \`name\` enum ('MANAGER', 'TECHNICIAN') NOT NULL,
                \`can_own_create\` tinyint NOT NULL,
                \`can_own_read\` tinyint NOT NULL,
                \`can_own_update\` tinyint NOT NULL,
                \`can_own_delete\` tinyint NOT NULL,
                \`can_global_create\` tinyint NOT NULL,
                \`can_global_read\` tinyint NOT NULL,
                \`can_global_update\` tinyint NOT NULL,
                \`can_global_delete\` tinyint NOT NULL,
                PRIMARY KEY (\`name\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`user\` (
                \`id\` varchar(36) NOT NULL,
                \`name\` varchar(256) NOT NULL,
                \`role_name\` enum ('MANAGER', 'TECHNICIAN') NOT NULL,
                \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`notification\` (
                \`id\` varchar(36) NOT NULL,
                \`type\` enum ('TASK_COMPLETED') NOT NULL,
                \`to_user_id\` varchar(255) NOT NULL,
                \`metadata\` json NOT NULL,
                \`is_read\` tinyint NOT NULL DEFAULT false,
                \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`task\` (
                \`id\` varchar(36) NOT NULL,
                \`summary\` varchar(2500) NOT NULL,
                \`completed_at\` datetime NULL,
                \`status\` enum ('NEW', 'ON_GOING', 'COMPLETED', 'ARCHIVED') NOT NULL,
                \`technician_id\` varchar(255) NOT NULL,
                \`manager_id\` varchar(255) NOT NULL,
                \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD CONSTRAINT \`FK_31f96f2013b7ac833d7682bf021\` FOREIGN KEY (\`role_name\`) REFERENCES \`role\`(\`name\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`notification\`
            ADD CONSTRAINT \`FK_9f4a43c2a59839b677d7c42f8e3\` FOREIGN KEY (\`to_user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`task\`
            ADD CONSTRAINT \`FK_07c6332c765aad6d74dc732defa\` FOREIGN KEY (\`technician_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`task\`
            ADD CONSTRAINT \`FK_e061e308a652cd1a79c15ebc18b\` FOREIGN KEY (\`manager_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`task\` DROP FOREIGN KEY \`FK_e061e308a652cd1a79c15ebc18b\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`task\` DROP FOREIGN KEY \`FK_07c6332c765aad6d74dc732defa\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_9f4a43c2a59839b677d7c42f8e3\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_31f96f2013b7ac833d7682bf021\`
        `);
    await queryRunner.query(`
            DROP TABLE \`task\`
        `);
    await queryRunner.query(`
            DROP TABLE \`notification\`
        `);
    await queryRunner.query(`
            DROP TABLE \`user\`
        `);
    await queryRunner.query(`
            DROP TABLE \`role\`
        `);
  }
}
