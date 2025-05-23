import { MigrationInterface, QueryRunner } from "typeorm";

export class LangMainAndLangList1747821807744 implements MigrationInterface {
    name = 'LangMainAndLangList1747821807744'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "lang_list" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" integer NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_by" integer NOT NULL, "deleted_at" TIMESTAMP WITH TIME ZONE, "lang_key" character varying NOT NULL, "lang_name" character varying NOT NULL, "lang_main_id" integer, CONSTRAINT "PK_3e89255843eb5d9c3ed524260a2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "lang_main" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" integer NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_by" integer NOT NULL, "deleted_at" TIMESTAMP WITH TIME ZONE, "lang_code" character varying(10) NOT NULL, "lang_name" character varying(100) NOT NULL, "active" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_f3ff9768f6d7b15feb95099243e" UNIQUE ("lang_code"), CONSTRAINT "PK_4bf153c6a7cbbd999ef092739a0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "lang_list" ADD CONSTRAINT "FK_aafd2ed368e2fd5d4ca661b570c" FOREIGN KEY ("lang_main_id") REFERENCES "lang_main"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lang_list" DROP CONSTRAINT "FK_aafd2ed368e2fd5d4ca661b570c"`);
        await queryRunner.query(`DROP TABLE "lang_main"`);
        await queryRunner.query(`DROP TABLE "lang_list"`);
    }

}
