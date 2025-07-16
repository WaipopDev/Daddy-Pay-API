import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class UpdateMachineProgram1752669479843 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("machine_program", new TableColumn({
            name: "status",
            type: "varchar",
            length: "50",
            isNullable: false,
            default: "'standby'"
        }));

        await queryRunner.addColumn("machine_program", new TableColumn({
            name: "error_message",
            type: "text",
            isNullable: true
        }));

        await queryRunner.addColumn("machine_program", new TableColumn({
            name: "last_connect",
            type: "timestamp",
            isNullable: true
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("machine_program", "status");
        await queryRunner.dropColumn("machine_program", "error_message");
        await queryRunner.dropColumn("machine_program", "last_connect");
    }

}
