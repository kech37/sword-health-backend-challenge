import { MigrationInterface, QueryRunner } from "typeorm";

export class Test1695857305653 implements MigrationInterface {
    name = 'Test1695857305653'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`user\` (
                \`id\` varchar(255) NOT NULL DEFAULT (UUID()),
                \`role\` enum ('MANAGER', 'TECHNICIAN') NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE \`user\`
        `);
    }

}
