import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTablesClientsEnvironmentsPlans1768056231368 implements MigrationInterface {
    name = 'CreateTablesClientsEnvironmentsPlans1768056231368'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tb_profiles" DROP CONSTRAINT "FK_00ffc165493998647c84f7cedb2"`);
        await queryRunner.query(`ALTER TABLE "tb_profiles" ALTER COLUMN "idtb_users" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tb_profiles" ADD CONSTRAINT "FK_00ffc165493998647c84f7cedb2" FOREIGN KEY ("idtb_users") REFERENCES "tb_users"("idtb_users") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tb_profiles" DROP CONSTRAINT "FK_00ffc165493998647c84f7cedb2"`);
        await queryRunner.query(`ALTER TABLE "tb_profiles" ALTER COLUMN "idtb_users" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tb_profiles" ADD CONSTRAINT "FK_00ffc165493998647c84f7cedb2" FOREIGN KEY ("idtb_users") REFERENCES "tb_users"("idtb_users") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
