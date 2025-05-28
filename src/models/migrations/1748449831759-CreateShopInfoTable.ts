import { MigrationInterface, QueryRunner, Table, Index } from "typeorm";

export class CreateShopInfoTable1748449831759 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "shop_info",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "shop_key",
                        type: "varchar",
                        length: "255",
                        isUnique: true,
                    },
                    {
                        name: "shop_code",
                        type: "varchar",
                        length: "255",
                        isUnique: true,
                    },
                    {
                        name: "shop_name",
                        type: "varchar",
                        length: "255",
                    },
                    {
                        name: "shop_address",
                        type: "text",
                        isNullable: true,
                    },
                    {
                        name: "shop_contact_info",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "shop_mobile_phone",
                        type: "varchar",
                        length: "20",
                        isNullable: true,
                    },
                    {
                        name: "shop_email",
                        type: "varchar",
                        length: "100",
                        isNullable: true,
                    },
                    {
                        name: "shop_latitude",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "shop_longitude",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "shop_status",
                        type: "varchar",
                        length: "20",
                        default: "'active'",
                    },
                    {
                        name: "shop_system_name",
                        type: "varchar",
                        length: "255",
                    },
                    {
                        name: "shop_upload_file",
                        type: "varchar",
                        length: "500",
                        isNullable: true,
                    },
                    {
                        name: "shop_tax_name",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "shop_tax_id",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "shop_tax_address",
                        type: "text",
                        isNullable: true,
                    },
                    {
                        name: "shop_bank_account",
                        type: "varchar",
                        length: "255",
                    },
                    {
                        name: "shop_bank_account_number",
                        type: "varchar",
                        length: "255",
                    },
                    {
                        name: "shop_bank_name",
                        type: "varchar",
                        length: "255",
                    },
                    {
                        name: "shop_bank_branch",
                        type: "varchar",
                        length: "255",
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
        await queryRunner.dropTable("shop_info");
    }
}
