import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateShopManagementTable1749209402784 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create shop_management table
        await queryRunner.createTable(new Table({
            name: "shop_management",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "shop_management_key",
                    type: "varchar",
                    length: "255",
                    isUnique: true,
                    isNullable: false,
                },
                {
                    name: "shop_management_name",
                    type: "varchar",
                    length: "255",
                    isNullable: false,
                },
                {
                    name: "shop_management_description",
                    type: "text",
                    isNullable: true,
                },
                {
                    name: "shop_management_machine_id",
                    type: "varchar",
                    length: "255",
                    isUnique: true,
                    isNullable: false,
                },
                {
                    name: "shop_management_iot_id",
                    type: "varchar",
                    length: "255",
                    isUnique: true,
                    isNullable: false,
                },
                {
                    name: "shop_management_status",
                    type: "varchar",
                    length: "20",
                    default: "'active'",
                    isNullable: false,
                },
                {
                    name: "shop_management_status_online",
                    type: "varchar",
                    length: "20",
                    default: "'active'",
                    isNullable: false,
                },
                {
                    name: "shop_management_interval_time",
                    type: "int",
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

        // Create unique index for shop_management_key
        await queryRunner.createIndex("shop_management", new TableIndex({
            name: "IDX_SHOP_MANAGEMENT_KEY",
            columnNames: ["shop_management_key"],
            isUnique: true,
        }));

        // Create unique index for shop_management_machine_id
        await queryRunner.createIndex("shop_management", new TableIndex({
            name: "IDX_SHOP_MANAGEMENT_MACHINE_ID",
            columnNames: ["shop_management_machine_id"],
            isUnique: true,
        }));

        // Create unique index for shop_management_iot_id
        await queryRunner.createIndex("shop_management", new TableIndex({
            name: "IDX_SHOP_MANAGEMENT_IOT_ID",
            columnNames: ["shop_management_iot_id"],
            isUnique: true,
        }));

        // Create foreign key constraint to shop_info table
        await queryRunner.createForeignKey("shop_management", new TableForeignKey({
            columnNames: ["shop_info_id"],
            referencedTableName: "shop_info",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            name: "FK_SHOP_MANAGEMENT_SHOP_INFO",
        }));

        // Create foreign key constraint to machine_info table
        await queryRunner.createForeignKey("shop_management", new TableForeignKey({
            columnNames: ["machine_info_id"],
            referencedTableName: "machine_info",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            name: "FK_SHOP_MANAGEMENT_MACHINE_INFO",
        }));

     

        // Create indexes for foreign keys for better query performance
        await queryRunner.createIndex("shop_management", new TableIndex({
            name: "IDX_SHOP_MANAGEMENT_SHOP_INFO_ID",
            columnNames: ["shop_info_id"],
        }));

        await queryRunner.createIndex("shop_management", new TableIndex({
            name: "IDX_SHOP_MANAGEMENT_MACHINE_INFO_ID",
            columnNames: ["machine_info_id"],
        }));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop the table (this will automatically drop all indexes and foreign keys)
        await queryRunner.dropTable("shop_management");
    }

}
