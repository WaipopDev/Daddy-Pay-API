import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateMachineProcess1752669906467 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create machine_transaction table
        await queryRunner.createTable(new Table({
            name: "machine_transaction",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
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
                    name: "machine_program_id",
                    type: "int",
                    isNullable: false,
                },
                {
                    name: "price_type",
                    type: "varchar",
                    length: "50",
                    isNullable: false,
                },
                {
                    name: "status",
                    type: "varchar",
                    length: "50",
                    default: "'standby'",
                    isNullable: false,
                },
                {
                    name: "transaction_id",
                    type: "varchar",
                    length: "255",
                    isNullable: true,
                },
                {
                    name: "transaction_iot",
                    type: "text",
                    isNullable: true,
                },
                {
                    name: "error_message",
                    type: "text",
                    isNullable: true,
                },
                {
                    name: "price",
                    type: "decimal",
                    precision: 10,
                    scale: 2,
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

        // Create index for transaction_id
        await queryRunner.createIndex("machine_transaction", new TableIndex({
            name: "IDX_MACHINE_TRANSACTION_TRANSACTION_ID",
            columnNames: ["transaction_id"],
        }));

        // Create index for status
        await queryRunner.createIndex("machine_transaction", new TableIndex({
            name: "IDX_MACHINE_TRANSACTION_STATUS",
            columnNames: ["status"],
        }));

        // Create foreign key constraint to shop_info table
        await queryRunner.createForeignKey("machine_transaction", new TableForeignKey({
            columnNames: ["shop_info_id"],
            referencedTableName: "shop_info",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            name: "FK_MACHINE_TRANSACTION_SHOP_INFO",
        }));

        // Create foreign key constraint to machine_info table
        await queryRunner.createForeignKey("machine_transaction", new TableForeignKey({
            columnNames: ["machine_info_id"],
            referencedTableName: "machine_info",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            name: "FK_MACHINE_TRANSACTION_MACHINE_INFO",
        }));

        // Create foreign key constraint to program_info table
        await queryRunner.createForeignKey("machine_transaction", new TableForeignKey({
            columnNames: ["program_info_id"],
            referencedTableName: "program_info",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            name: "FK_MACHINE_TRANSACTION_PROGRAM_INFO",
        }));

        // Create foreign key constraint to machine_program table
        await queryRunner.createForeignKey("machine_transaction", new TableForeignKey({
            columnNames: ["machine_program_id"],
            referencedTableName: "machine_program",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            name: "FK_MACHINE_TRANSACTION_MACHINE_PROGRAM",
        }));

        // Create indexes for foreign keys for better query performance
        await queryRunner.createIndex("machine_transaction", new TableIndex({
            name: "IDX_MACHINE_TRANSACTION_SHOP_INFO_ID",
            columnNames: ["shop_info_id"],
        }));

        await queryRunner.createIndex("machine_transaction", new TableIndex({
            name: "IDX_MACHINE_TRANSACTION_MACHINE_INFO_ID",
            columnNames: ["machine_info_id"],
        }));

        await queryRunner.createIndex("machine_transaction", new TableIndex({
            name: "IDX_MACHINE_TRANSACTION_PROGRAM_INFO_ID",
            columnNames: ["program_info_id"],
        }));

        await queryRunner.createIndex("machine_transaction", new TableIndex({
            name: "IDX_MACHINE_TRANSACTION_MACHINE_PROGRAM_ID",
            columnNames: ["machine_program_id"],
        }));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop the table (this will automatically drop all indexes and foreign keys)
        await queryRunner.dropTable("machine_transaction");
    }

}
