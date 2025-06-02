import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateProgramInfoInfoTable1748874639745 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create program_info table
        await queryRunner.createTable(new Table({
            name: "program_info",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "program_key",
                    type: "varchar",
                    length: "255",
                    isUnique: true,
                    isNullable: false,
                },
                {
                    name: "machine_info_id",
                    type: "int",
                    isNullable: false,
                },
                {
                    name: "program_name",
                    type: "varchar",
                    length: "255",
                    isNullable: false,
                },
                {
                    name: "program_description",
                    type: "varchar",
                    length: "255",
                    isNullable: true,
                },
                {
                    name: "created_at",
                    type: "timestamptz",
                    default: "CURRENT_TIMESTAMP",
                    isNullable: false,
                },
                {
                    name: "created_by",
                    type: "int",
                    isNullable: false,
                },
                {
                    name: "updated_at",
                    type: "timestamptz",
                    default: "CURRENT_TIMESTAMP",
                    onUpdate: "CURRENT_TIMESTAMP",
                    isNullable: false,
                },
                {
                    name: "updated_by",
                    type: "int",
                    isNullable: false,
                },
                {
                    name: "deleted_at",
                    type: "timestamptz",
                    isNullable: true,
                },
            ],
        }), true);

        // Create unique index for program_key
        await queryRunner.createIndex("program_info", new TableIndex({
            name: "IDX_PROGRAM_INFO_PROGRAM_KEY",
            columnNames: ["program_key"],
            isUnique: true,
        }));

        // Create foreign key constraint to machine_info table
        await queryRunner.createForeignKey("program_info", new TableForeignKey({
            columnNames: ["machine_info_id"],
            referencedTableName: "machine_info",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            name: "FK_PROGRAM_INFO_MACHINE_INFO",
        }));

        // Create index for machine_info_id for better query performance
        await queryRunner.createIndex("program_info", new TableIndex({
            name: "IDX_PROGRAM_INFO_MACHINE_INFO_ID",
            columnNames: ["machine_info_id"],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop the table (this will automatically drop all indexes and foreign keys)
        await queryRunner.dropTable("program_info");
    }

}
