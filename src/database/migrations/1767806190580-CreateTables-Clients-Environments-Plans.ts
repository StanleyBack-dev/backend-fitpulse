import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTablesClientsEnvironmentsPlans1767806190580 implements MigrationInterface {
    name = 'CreateTablesClientsEnvironmentsPlans1767806190580'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tb_profiles" DROP COLUMN "currentWeight"`);
        await queryRunner.query(`ALTER TABLE "tb_profiles" ADD "currentWeight" integer`);
        await queryRunner.query(`ALTER TABLE "tb_profiles" DROP COLUMN "currentHeight"`);
        await queryRunner.query(`ALTER TABLE "tb_profiles" ADD "currentHeight" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tb_profiles" DROP COLUMN "currentHeight"`);
        await queryRunner.query(`ALTER TABLE "tb_profiles" ADD "currentHeight" numeric(4,2)`);
        await queryRunner.query(`ALTER TABLE "tb_profiles" DROP COLUMN "currentWeight"`);
        await queryRunner.query(`ALTER TABLE "tb_profiles" ADD "currentWeight" numeric(5,2)`);
    }

}
