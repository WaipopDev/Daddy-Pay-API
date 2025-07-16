import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class UpdateShopManagement1752674536750 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("shop_management", new TableColumn({
            name: "status",
            type: "varchar",
            length: "50",
            isNullable: false,
            default: "'standby'"
        }));

        await queryRunner.addColumn("shop_management", new TableColumn({
            name: "error_message",
            type: "text",
            isNullable: true
        }));

        await queryRunner.addColumn("shop_management", new TableColumn({
            name: "last_connect",
            type: "timestamp",
            isNullable: true
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("shop_management", "status");
        await queryRunner.dropColumn("shop_management", "error_message");
        await queryRunner.dropColumn("shop_management", "last_connect");
    }

}
