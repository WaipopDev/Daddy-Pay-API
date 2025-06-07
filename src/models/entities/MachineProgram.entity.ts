import { Column, Entity, JoinColumn, ManyToOne } from "typeorm"
import { DefaultEntity } from "./default.entity";
import { MachineInfoEntity } from "./MachineInfo.entity";
import { ShopInfoEntity } from "./ShopInfo.entity";
import { ProgramInfoEntity } from "./ProgramInfo.entity";

@Entity({ name: 'machine_program' })
export class MachineProgramEntity extends DefaultEntity {
    @Column({ name: 'machine_program_key', type: 'varchar', length: 255, unique: true })
    machineProgramKey: string;

    @Column({ name: 'shop_info_id', type: 'int' })
    shopInfoId: number;

    @ManyToOne(() => ShopInfoEntity, { nullable: false })
    @JoinColumn({ name: 'shop_info_id' })
    shopInfo: ShopInfoEntity;

    @Column({ name: 'machine_info_id', type: 'int' })
    machineInfoId: number;

    @ManyToOne(() => MachineInfoEntity, { nullable: false })
    @JoinColumn({ name: 'machine_info_id' })
    machineInfo: MachineInfoEntity;

    @Column({ name: 'program_info_id', type: 'int' })
    programInfoId: number;

    @ManyToOne(() => ProgramInfoEntity, { nullable: false })
    @JoinColumn({ name: 'program_info_id' })
    programInfo: ProgramInfoEntity;

    @Column({ name: 'machine_program_price', type: 'decimal', precision: 10, scale: 2, nullable: false })
    machineProgramPrice: number;

    @Column({ name: 'machine_program_operation_time', type: 'int', nullable: false })
    machineProgramOperationTime: number;

    @Column({ name: 'machine_program_status', type: 'varchar', length: 255, nullable: false })
    machineProgramStatus: string;

}
