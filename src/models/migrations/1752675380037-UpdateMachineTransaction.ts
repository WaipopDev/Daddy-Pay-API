import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class UpdateMachineTransaction1752675380037 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.addColumn("machine_transaction", new TableColumn({
                    name: "shop_management_id",
                    type: "int",
                    isNullable: false,
                }));
        await queryRunner.createForeignKey("machine_transaction", new TableForeignKey({
            columnNames: ["shop_management_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "shop_management",
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("machine_transaction", "FK_MACHINE_TRANSACTION_SHOP_MANAGEMENT");
        await queryRunner.dropColumn("machine_transaction", "shop_management_id");
    }

}
