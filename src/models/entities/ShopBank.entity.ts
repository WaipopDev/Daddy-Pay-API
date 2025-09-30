import { Entity, Column, OneToOne } from "typeorm"
import { DefaultEntity } from "./default.entity";
import { ShopInfoEntity } from "./ShopInfo.entity";
import { BankParam } from "../../types/bank-param.interface";

@Entity({name: "shop_bank"})
export class ShopBankEntity extends DefaultEntity {

    @Column({ name: 'title', type: 'varchar', length: 255 })
    title: string;

    @Column({ name: 'param', type: 'json', nullable: true })
    param: BankParam;

    @OneToOne(() => ShopInfoEntity, (shopInfo) => shopInfo.bankActive)
    shopInfo: ShopInfoEntity;
}
