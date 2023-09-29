import { MigrationInterface, QueryRunner } from 'typeorm';

export class Triggers1696007780613 implements MigrationInterface {
  name = 'Triggers1696007780613';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TRIGGER \`update_updated_at\`
      BEFORE UPDATE ON \`task\` FOR EACH ROW
      BEGIN
          SET NEW.\`updated_at\` = NOW();
      END
    `);
    await queryRunner.query(`
      CREATE TRIGGER \`update_completed_at\`
      BEFORE UPDATE ON \`task\` FOR EACH ROW
      BEGIN
          IF NEW.\`status\` = 'COMPLETED' AND OLD.\`status\` != 'COMPLETED' THEN
              SET NEW.\`completed_at\` = NOW();
          END IF;
      END
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS \`update_updated_at\``);
    await queryRunner.query(`DROP TRIGGER IF EXISTS \`update_completed_at\``);
  }
}
