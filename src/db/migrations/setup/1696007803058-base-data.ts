import { MigrationInterface, QueryRunner } from 'typeorm';

export class BaseData1696007803058 implements MigrationInterface {
  name = 'BaseData1696007803058';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO \`public\`.\`role\` (\`name\`, \`can_own_create\`, \`can_own_read\`, \`can_own_update\`, \`can_own_delete\`, \`can_global_create\`, \`can_global_read\`, \`can_global_update\`, \`can_global_delete\`) VALUES ('MANAGER', '1', '1', '1', '1', '0', '1', '0', '1')`,
    );
    await queryRunner.query(
      `INSERT INTO \`public\`.\`role\` (\`name\`, \`can_own_create\`, \`can_own_read\`, \`can_own_update\`, \`can_own_delete\`, \`can_global_create\`, \`can_global_read\`, \`can_global_update\`, \`can_global_delete\`) VALUES ('TECHNICIAN', '1', '1', '1', '0', '0', '0', '0', '0')`,
    );
    await queryRunner.query(
      `INSERT INTO \`public\`.\`user\` (\`id\`, \`name\`, \`role_name\`) VALUES ('fa634d9f-7a47-4efb-b432-812d2b449dd5', 'Manager #1', 'MANAGER')`,
    );
    await queryRunner.query(
      `INSERT INTO \`public\`.\`user\` (\`id\`, \`name\`, \`role_name\`) VALUES ('41f71b67-a18c-4374-87a4-b2ed044fdbde', 'Technician #1', 'TECHNICIAN')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM \`public\`.\`notification\``);
    await queryRunner.query(`DELETE FROM \`public\`.\`task\``);
    await queryRunner.query(`DELETE FROM \`public\`.\`user\` WHERE \`id\` = '41f71b67-a18c-4374-87a4-b2ed044fdbde'`);
    await queryRunner.query(`DELETE FROM \`public\`.\`user\` WHERE \`id\` = 'fa634d9f-7a47-4efb-b432-812d2b449dd5'`);
    await queryRunner.query(`DELETE FROM \`public\`.\`role\` WHERE \`name\` = 'TECHNICIAN'`);
    await queryRunner.query(`DELETE FROM \`public\`.\`role\` WHERE \`name\` = 'MANAGER'`);
  }
}
