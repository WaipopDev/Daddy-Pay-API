import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddSubscriptionColumnsToShopInfo1767123700000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('shop_info', new TableColumn({
            name: 'sub_registration_date',
            type: 'date',
            isNullable: true,
        }));

        await queryRunner.addColumn('shop_info', new TableColumn({
            name: 'sub_expiration_date',
            type: 'date',
            isNullable: true,
        }));

        await queryRunner.addColumn('shop_info', new TableColumn({
            name: 'sub_subscription_status',
            type: 'varchar',
            length: '20',
            default: "'active'",
            isNullable: false,
        }));

        await queryRunner.addColumn('shop_info', new TableColumn({
            name: 'sub_notification_cycle',
            type: 'int',
            isNullable: true,
        }));

        await queryRunner.addColumn('shop_info', new TableColumn({
            name: 'sub_notify_to_email',
            type: 'text',
            isNullable: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('shop_info', 'sub_notify_to_email');
        await queryRunner.dropColumn('shop_info', 'sub_notification_cycle');
        await queryRunner.dropColumn('shop_info', 'sub_subscription_status');
        await queryRunner.dropColumn('shop_info', 'sub_expiration_date');
        await queryRunner.dropColumn('shop_info', 'sub_registration_date');
    }
}
