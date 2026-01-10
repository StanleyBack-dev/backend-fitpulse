import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTablesClientsEnvironmentsPlans1768063520322 implements MigrationInterface {
    name = 'CreateTablesClientsEnvironmentsPlans1768063520322'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tb_health" DROP COLUMN "measurement_date"`);
        await queryRunner.query(`ALTER TABLE "tb_health" ADD "measurement_date" date NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tb_health" DROP COLUMN "measurement_date"`);
        await queryRunner.query(`ALTER TABLE "tb_health" ADD "measurement_date" TIMESTAMP WITH TIME ZONE NOT NULL`);
    }

}
