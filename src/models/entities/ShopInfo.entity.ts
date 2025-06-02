import { Entity, Column } from "typeorm"
import { DefaultEntity } from "./default.entity";

@Entity({name: "shop_info"})
export class ShopInfoEntity extends DefaultEntity {

    @Column({ name: 'shop_key', type: 'varchar', length: 255, unique: true })
    shopKey: string;

    @Column({ name: 'shop_code', type: 'varchar', length: 255, unique: true })
    shopCode: string;

    @Column({ name: 'shop_name', type: 'varchar', length: 255 })
    shopName: string;

    @Column({ name: 'shop_address', type: 'text', nullable: true })
    shopAddress: string;

    @Column({ name: 'shop_contact_info', type: 'varchar', length: 255, nullable: true })
    shopContactInfo: string;

    @Column({ name: 'shop_mobile_phone', type: 'varchar', length: 20, nullable: true })
    shopMobilePhone: string;

    @Column({ name: 'shop_email', type: 'varchar', length: 100, nullable: true })
    shopEmail: string;

    @Column({ name: 'shop_latitude', type: 'varchar', length: 255, nullable: true })
    shopLatitude: string;

    @Column({ name: 'shop_longitude', type: 'varchar', length: 255, nullable: true })
    shopLongitude: string;

    @Column({ name: 'shop_status', type: 'varchar', length: 20, default: 'active' })
    shopStatus: string;

    @Column({ name: 'shop_system_name', type: 'varchar', length: 255 })
    shopSystemName: string;

    @Column({ name: 'shop_upload_file', type: 'text', nullable: true })
    shopUploadFile: string;

    @Column({ name: 'shop_tax_name', type: 'varchar', length: 255, nullable: true })
    shopTaxName: string;

    @Column({ name: 'shop_tax_id', type: 'varchar', length: 255, nullable: true })
    shopTaxId: string;

    @Column({ name: 'shop_tax_address', type: 'text', nullable: true })
    shopTaxAddress: string;

    @Column({ name: 'shop_bank_account', type: 'varchar', length: 255 })
    shopBankAccount: string;

    @Column({ name: 'shop_bank_account_number', type: 'varchar', length: 255 })
    shopBankAccountNumber: string;

    @Column({ name: 'shop_bank_name', type: 'varchar', length: 255 })
    shopBankName: string;

    @Column({ name: 'shop_bank_branch', type: 'varchar', length: 255 })
    shopBankBranch: string;
}
