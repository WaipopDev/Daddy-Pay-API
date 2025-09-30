import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddBankActiveColumnsToShopInfo1759221832300 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("shop_info", new TableColumn({
            name: "bank_active_name",
            type: "varchar",
            length: "255",
            isNullable: true,
        }));

        await queryRunner.addColumn("shop_info", new TableColumn({
            name: "bank_active_id",
            type: "int",
            isNullable: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("shop_info", "bank_active_id");
        await queryRunner.dropColumn("shop_info", "bank_active_name");
    }
}
