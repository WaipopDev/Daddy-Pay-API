import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateMachineProgramTable1749322761154 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create machine_program table
        await queryRunner.createTable(new Table({
            name: "machine_program",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "machine_program_key",
                    type: "varchar",
                    length: "255",
                    isUnique: true,
                    isNullable: false,
                },
                {
                    name: "shop_info_id",
                    type: "int",
                    isNullable: false,
                },
                {
                    name: "machine_info_id",
                    type: "int",
                    isNullable: false,
                },
                {
                    name: "program_info_id",
                    type: "int",
                    isNullable: false,
                },
                {
                    name: "machine_program_price",
                    type: "decimal",
                    precision: 10,
                    scale: 2,
                    isNullable: false,
                },
                {
                    name: "machine_program_operation_time",
                    type: "int",
                    isNullable: false,
                },
                {
                    name: "machine_program_status",
                    type: "varchar",
                    length: "255",
                    isNullable: false,
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

        // Create unique index for machine_program_key
        await queryRunner.createIndex("machine_program", new TableIndex({
            name: "IDX_MACHINE_PROGRAM_KEY",
            columnNames: ["machine_program_key"],
            isUnique: true,
        }));

        // Create foreign key constraint to shop_info table
        await queryRunner.createForeignKey("machine_program", new TableForeignKey({
            columnNames: ["shop_info_id"],
            referencedTableName: "shop_info",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            name: "FK_MACHINE_PROGRAM_SHOP_INFO",
        }));

        // Create foreign key constraint to machine_info table
        await queryRunner.createForeignKey("machine_program", new TableForeignKey({
            columnNames: ["machine_info_id"],
            referencedTableName: "machine_info",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            name: "FK_MACHINE_PROGRAM_MACHINE_INFO",
        }));

        // Create foreign key constraint to program_info table
        await queryRunner.createForeignKey("machine_program", new TableForeignKey({
            columnNames: ["program_info_id"],
            referencedTableName: "program_info",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            name: "FK_MACHINE_PROGRAM_PROGRAM_INFO",
        }));

        // Create indexes for foreign keys for better query performance
        await queryRunner.createIndex("machine_program", new TableIndex({
            name: "IDX_MACHINE_PROGRAM_SHOP_INFO_ID",
            columnNames: ["shop_info_id"],
        }));

        await queryRunner.createIndex("machine_program", new TableIndex({
            name: "IDX_MACHINE_PROGRAM_MACHINE_INFO_ID",
            columnNames: ["machine_info_id"],
        }));

        await queryRunner.createIndex("machine_program", new TableIndex({
            name: "IDX_MACHINE_PROGRAM_PROGRAM_INFO_ID",
            columnNames: ["program_info_id"],
        }));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop the table (this will automatically drop all indexes and foreign keys)
        await queryRunner.dropTable("machine_program");
    }

}
