import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class UsersPermissions1758470600341 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "users_permissions",
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "user_id", type: "int", isPrimary: true },
                { name: "shop_id", type: "int" },
                { name: "status", type: "varchar", length: "255", default: "'active'" },
                { name: "created_at", type: "timestamptz", default: "CURRENT_TIMESTAMP" },
                { name: "created_by", type: "int" },
                { name: "updated_at", type: "timestamptz", default: "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" },
                { name: "updated_by", type: "int" },
                { name: "deleted_at", type: "timestamptz", isNullable: true },
            ],
        }));
        await queryRunner.createForeignKey("users_permissions", new TableForeignKey({
            columnNames: ["user_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        }));
        await queryRunner.createForeignKey("users_permissions", new TableForeignKey({
            columnNames: ["shop_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "shop_info",
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        }));
        await queryRunner.createIndex("users_permissions", new TableIndex({
            name: "IDX_USERS_PERMISSIONS_USER_ID",
            columnNames: ["user_id"]
        }));
        await queryRunner.createIndex("users_permissions", new TableIndex({
            name: "IDX_USERS_PERMISSIONS_SHOP_ID",
            columnNames: ["shop_id"]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("users_permissions", "FK_USERS_PERMISSIONS_USERS");
        await queryRunner.dropForeignKey("users_permissions", "FK_USERS_PERMISSIONS_SHOPS");
        await queryRunner.dropTable("users_permissions");
    }

}
