import { Column, Entity, ManyToOne, JoinColumn } from "typeorm"
import { DefaultEntity } from "./default.entity";
import { ShopInfoEntity } from "./ShopInfo.entity";
import { MachineInfoEntity } from "./MachineInfo.entity";

@Entity({ name: "shop_management" })
export class ShopManagementEntity extends DefaultEntity{
    @Column({ name: 'shop_management_key', type: 'varchar', length: 255, unique: true })
    shopManagementKey: string;

    @Column({ name: 'shop_management_name', type: 'varchar', length: 255 })
    shopManagementName: string;

    @Column({ name: 'shop_management_description', type: 'text', nullable: true })
    shopManagementDescription: string;

    @Column({ name: 'shop_management_machine_id', type: 'varchar', length: 255, unique: true })
    shopManagementMachineID: string;

    @Column({ name: 'shop_management_iot_id', type: 'varchar', length: 255, unique: true })
    shopManagementIotID: string;

    @Column({ name: 'shop_management_status', type: 'varchar', length: 20, default: 'active' })
    shopManagementStatus: string;

    @Column({ name: 'shop_management_status_online', type: 'varchar', length: 20, default: 'active' })
    shopManagementStatusOnline: string;

    @Column({ name: 'shop_management_interval_time', type: 'int' })
    shopManagementIntervalTime: number;

    @Column({ name: 'shop_info_id', type: 'int' })
    shopInfoID: number;

    @ManyToOne(() => ShopInfoEntity, { nullable: false })
    @JoinColumn({ name: 'shop_info_id' })
    shopInfo: ShopInfoEntity;

    @Column({ name: 'machine_info_id', type: 'int' })
    machineInfoID: number;

    @ManyToOne(() => MachineInfoEntity, { nullable: false })
    @JoinColumn({ name: 'machine_info_id' })
    machineInfo: MachineInfoEntity;

    @Column({ name: 'status', type: 'varchar', length: 50, default: 'standby' })
    status: string;

    @Column({ name: 'error_message', type: 'text', nullable: true })
    errorMessage?: string;

    @Column({ name: 'last_connect', type: 'timestamp', nullable: true })
    lastConnect?: Date;

}
