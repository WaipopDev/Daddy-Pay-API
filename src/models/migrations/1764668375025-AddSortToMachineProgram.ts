import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddSortToMachineProgram1764668375025 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("machine_program", new TableColumn({
            name: "sort",
            type: "int",
            isNullable: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("machine_program", "sort");
    }

}
