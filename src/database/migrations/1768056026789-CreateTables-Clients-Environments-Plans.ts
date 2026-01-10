import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTablesClientsEnvironmentsPlans1768056026789 implements MigrationInterface {
    name = 'CreateTablesClientsEnvironmentsPlans1768056026789'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tb_health" DROP COLUMN "ip_address"`);
        await queryRunner.query(`ALTER TABLE "tb_health" DROP COLUMN "user_agent"`);
        await queryRunner.query(`ALTER TABLE "tb_profiles" DROP COLUMN "currentWeight"`);
        await queryRunner.query(`ALTER TABLE "tb_profiles" ADD "currentWeight" double precision`);
        await queryRunner.query(`ALTER TABLE "tb_profiles" DROP COLUMN "currentImc"`);
        await queryRunner.query(`ALTER TABLE "tb_profiles" ADD "currentImc" double precision`);
        await queryRunner.query(`ALTER TABLE "tb_health" DROP COLUMN "weight_kg"`);
        await queryRunner.query(`ALTER TABLE "tb_health" ADD "weight_kg" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tb_health" DROP COLUMN "bmi"`);
        await queryRunner.query(`ALTER TABLE "tb_health" ADD "bmi" double precision NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tb_health" DROP COLUMN "bmi"`);
        await queryRunner.query(`ALTER TABLE "tb_health" ADD "bmi" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tb_health" DROP COLUMN "weight_kg"`);
        await queryRunner.query(`ALTER TABLE "tb_health" ADD "weight_kg" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tb_profiles" DROP COLUMN "currentImc"`);
        await queryRunner.query(`ALTER TABLE "tb_profiles" ADD "currentImc" integer`);
        await queryRunner.query(`ALTER TABLE "tb_profiles" DROP COLUMN "currentWeight"`);
        await queryRunner.query(`ALTER TABLE "tb_profiles" ADD "currentWeight" integer`);
        await queryRunner.query(`ALTER TABLE "tb_health" ADD "user_agent" character varying`);
        await queryRunner.query(`ALTER TABLE "tb_health" ADD "ip_address" character varying`);
    }

}
