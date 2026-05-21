import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddOnlinePaymentColumnsToShopInfo1767123600000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('shop_info', new TableColumn({
            name: 'online_payment_status',
            type: 'varchar',
            length: '20',
            default: "'enable'",
            isNullable: false,
        }));

        await queryRunner.addColumn('shop_info', new TableColumn({
            name: 'online_activation_date',
            type: 'date',
            isNullable: true,
        }));

        await queryRunner.addColumn('shop_info', new TableColumn({
            name: 'online_close_date',
            type: 'date',
            isNullable: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('shop_info', 'online_close_date');
        await queryRunner.dropColumn('shop_info', 'online_activation_date');
        await queryRunner.dropColumn('shop_info', 'online_payment_status');
    }
}
