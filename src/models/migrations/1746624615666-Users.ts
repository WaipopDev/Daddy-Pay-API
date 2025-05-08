import { MigrationInterface, QueryRunner } from "typeorm";

export class Users1746624615666 implements MigrationInterface {
    name = 'Users1746624615666'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" integer NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_by" integer NOT NULL, "deleted_at" TIMESTAMP WITH TIME ZONE, "username" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "email" character varying(100) NOT NULL, "role" character varying(100) NOT NULL, "active" boolean NOT NULL DEFAULT true, "subscribe" boolean NOT NULL DEFAULT false, "is_verified" boolean NOT NULL DEFAULT false, "is_admin_level" integer NOT NULL DEFAULT '0', "subscribe_start_date" date, "subscribe_end_date" date, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
