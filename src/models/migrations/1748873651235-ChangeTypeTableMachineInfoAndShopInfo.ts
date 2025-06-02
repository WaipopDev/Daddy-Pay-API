import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class ChangeTypeTableMachineInfoAndShopInfo1748873651235 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Change machine_info.machine_picture_path from varchar(255) to text
        await queryRunner.changeColumn("machine_info", "machine_picture_path", new TableColumn({
            name: "machine_picture_path",
            type: "text",
            isNullable: true,
        }));

        // Change shop_info.shop_upload_file from varchar(500) to text
        await queryRunner.changeColumn("shop_info", "shop_upload_file", new TableColumn({
            name: "shop_upload_file",
            type: "text",
            isNullable: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert machine_info.machine_picture_path from text to varchar(255)
        await queryRunner.changeColumn("machine_info", "machine_picture_path", new TableColumn({
            name: "machine_picture_path",
            type: "varchar",
            length: "255",
            isNullable: true,
        }));

        // Revert shop_info.shop_upload_file from text to varchar(500)
        await queryRunner.changeColumn("shop_info", "shop_upload_file", new TableColumn({
            name: "shop_upload_file",
            type: "varchar",
            length: "500",
            isNullable: true,
        }));
    }

}
