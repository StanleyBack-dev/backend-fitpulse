import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTablesClientsEnvironmentsPlans1768056969594 implements MigrationInterface {
    name = 'CreateTablesClientsEnvironmentsPlans1768056969594'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tb_profiles" ("idtb_profiles" uuid NOT NULL DEFAULT uuid_generate_v4(), "idtb_users" uuid NOT NULL, "phone" character varying, "currentWeight" double precision, "currentHeight" integer, "currentImc" double precision, "birthDate" date, "sex" "public"."tb_profiles_sex_enum", "activityLevel" "public"."tb_profiles_activitylevel_enum", "goal" "public"."tb_profiles_goal_enum", "ip_address" character varying, "user_agent" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_00ffc165493998647c84f7cedb" UNIQUE ("idtb_users"), CONSTRAINT "PK_1cee2c4d689a6f628a604fb1a32" PRIMARY KEY ("idtb_profiles"))`);
        await queryRunner.query(`ALTER TABLE "tb_profiles" ADD CONSTRAINT "FK_00ffc165493998647c84f7cedb2" FOREIGN KEY ("idtb_users") REFERENCES "tb_users"("idtb_users") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tb_profiles" DROP CONSTRAINT "FK_00ffc165493998647c84f7cedb2"`);
        await queryRunner.query(`DROP TABLE "tb_profiles"`);
    }

}
