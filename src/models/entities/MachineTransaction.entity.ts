import { Column, Entity, JoinColumn, ManyToOne } from "typeorm"
import { DefaultEntity } from "./default.entity";
import { ShopInfoEntity } from "./ShopInfo.entity";
import { MachineInfoEntity } from "./MachineInfo.entity";
import { ProgramInfoEntity } from "./ProgramInfo.entity";
import { MachineProgramEntity } from "./MachineProgram.entity";
import { ShopManagementEntity } from "./ShopManagement.entity";

@Entity({ name: 'machine_transaction' })
export class MachineTransactionEntity extends DefaultEntity {

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

    @Column({ name: 'machine_program_id', type: 'int' })
    machineProgramId: number;

    @ManyToOne(() => MachineProgramEntity, { nullable: false })
    @JoinColumn({ name: 'machine_program_id' })
    machineProgram: MachineProgramEntity;

    @Column({ name: 'price_type', type: 'varchar', length: 50 })
    priceType: string;

    @Column({ name: 'status', type: 'varchar', length: 50, default: 'standby' })
    status: string;

    @Column({ name: 'transaction_id', type: 'varchar', length: 255, nullable: true })
    transactionId?: string;

    @Column({ name: 'transaction_iot', type: 'text', nullable: true })
    transactionIot?: string;

    @Column({ name: 'error_message', type: 'text', nullable: true })
    errorMessage?: string;

    @Column({ name: 'price', type: 'decimal', precision: 10, scale: 2, nullable: false })
    price: number;

    @Column({ name: 'shop_management_id', type: 'int', nullable: false })
    shopManagementId: number;

    @ManyToOne(() => ShopManagementEntity, { nullable: false })
    @JoinColumn({ name: 'shop_management_id' })
    shopManagement: ShopManagementEntity;
}
