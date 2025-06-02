import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateMachineInfoTable1748866923247 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "machine_info",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "machine_key",
                        type: "varchar",
                        length: "255",
                        isUnique: true,
                    },
                    {
                        name: "machine_type",
                        type: "varchar",
                        length: "255",
                    },
                    {
                        name: "machine_brand",
                        type: "varchar",
                        length: "255",
                    },
                    {
                        name: "machine_model",
                        type: "varchar",
                        length: "255",
                    },
                    {
                        name: "machine_description",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "machine_picture_path",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "created_by",
                        type: "int",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updated_by",
                        type: "int",
                    },
                    {
                        name: "deleted_at",
                        type: "timestamp",
                        isNullable: true,
                    },
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("machine_info");
    }

}
