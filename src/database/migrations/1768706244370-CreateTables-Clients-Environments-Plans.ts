import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTablesClientsEnvironmentsPlans1768706244370 implements MigrationInterface {
    name = 'CreateTablesClientsEnvironmentsPlans1768706244370'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tb_profiles" DROP COLUMN "currentWeight"`);
        await queryRunner.query(`ALTER TABLE "tb_profiles" DROP COLUMN "currentHeight"`);
        await queryRunner.query(`ALTER TABLE "tb_profiles" DROP COLUMN "currentImc"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tb_profiles" ADD "currentImc" double precision`);
        await queryRunner.query(`ALTER TABLE "tb_profiles" ADD "currentHeight" integer`);
        await queryRunner.query(`ALTER TABLE "tb_profiles" ADD "currentWeight" double precision`);
    }

}
