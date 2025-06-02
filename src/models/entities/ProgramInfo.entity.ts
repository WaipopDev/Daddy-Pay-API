import { Column, Entity, ManyToOne, JoinColumn } from "typeorm"
import { DefaultEntity } from "./default.entity";
import { MachineInfoEntity } from "./MachineInfo.entity";

@Entity({ name: "program_info" })
export class ProgramInfoEntity extends DefaultEntity {
    @Column({ name: 'program_key', type: 'varchar', length: 255, unique: true })
    programKey: string;

    @Column({ name: 'machine_info_id', type: 'int' })
    machineInfoId: number;

    @ManyToOne(() => MachineInfoEntity, { nullable: false })
    @JoinColumn({ name: 'machine_info_id' })
    machineInfo: MachineInfoEntity;

    @Column({ name: 'program_name', type: 'varchar', length: 255 })
    programName: string;

    @Column({ name: 'program_description', type: 'varchar', length: 255, nullable: true })
    programDescription: string;
}