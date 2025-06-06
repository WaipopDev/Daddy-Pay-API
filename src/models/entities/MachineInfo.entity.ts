import { Column, Entity, OneToMany } from "typeorm"
import { DefaultEntity } from "./default.entity";
import { ProgramInfoEntity } from "./ProgramInfo.entity";

@Entity({ name: "machine_info" })
export class MachineInfoEntity extends DefaultEntity {
    @Column({ name: 'machine_key', type: 'varchar', length: 255, unique: true })
    machineKey: string;

    @Column({ name: 'machine_type', type: 'varchar', length: 255})
    machineType: string;

    @Column({ name: 'machine_brand', type: 'varchar', length: 255 })
    machineBrand: string;

    @Column({ name: 'machine_model', type: 'varchar', length: 255 })
    machineModel: string;

    @Column({ name: 'machine_description', type: 'varchar', length: 255, nullable: true })
    machineDescription: string;

    @Column({ name: 'machine_picture_path', type: 'text', nullable: true })
    machinePicturePath: string;

    @OneToMany(() => ProgramInfoEntity, program => program.machineInfo)
    programs: ProgramInfoEntity[];
}
