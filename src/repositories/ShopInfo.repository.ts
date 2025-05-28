import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, FindOptionsWhere } from 'typeorm';

import { ShopInfoEntity } from 'src/models/entities/ShopInfo.entity';

export class ShopInfoRepository {
    constructor(@InjectEntityManager() private readonly db: EntityManager) { }
    
    private get repo() {
        return this.db.getRepository(ShopInfoEntity);
    }

    private async findOneShopInfo(where: FindOptionsWhere<ShopInfoEntity>) {
        return this.repo.findOne({
            where: where,
            select: {
                id: true,
                shopKey: true,
                shopCode: true,
                shopName: true,
                shopAddress: true,
                shopContactInfo: true,
                shopMobilePhone: true,
                shopEmail: true,
                shopLatitude: true,
                shopLongitude: true,
                shopStatus: true,
                shopSystemName: true,
                shopUploadFile: true,
                shopTaxName: true,
                shopTaxId: true,
                shopTaxAddress: true,
                shopBankAccount: true,
                shopBankAccountNumber: true,
                shopBankName: true,
                shopBankBranch: true,
                createdAt: true,
                updatedAt: true,
                createdBy: true,
                updatedBy: true
            },
        });
    }

    async findShopInfoByCode(shopCode: string): Promise<ShopInfoEntity | null> {
        return this.findOneShopInfo({ shopCode });
    }

    async findShopInfoByKey(shopKey: string): Promise<ShopInfoEntity | null> {
        return this.findOneShopInfo({ shopKey });
    }
    
    async findShopInfoById(id: number): Promise<ShopInfoEntity | null> {
        return this.findOneShopInfo({ id });
    }

    async findAll(): Promise<ShopInfoEntity[]> {
        return this.repo.find({
            select: {
                id: true,
                shopKey: true,
                shopCode: true,
                shopName: true,
                shopAddress: true,
                shopContactInfo: true,
                shopMobilePhone: true,
                shopEmail: true,
                shopLatitude: true,
                shopLongitude: true,
                shopStatus: true,
                shopSystemName: true,
                shopUploadFile: true,
                shopTaxName: true,
                shopTaxId: true,
                shopTaxAddress: true,
                shopBankAccount: true,
                shopBankAccountNumber: true,
                shopBankName: true,
                shopBankBranch: true,
                createdAt: true,
                updatedAt: true,
                createdBy: true,
                updatedBy: true
            },
        });
    }

    async findById(id: number): Promise<ShopInfoEntity | null> {
        return this.repo.findOneBy({ id });
    }

    async create(data: Partial<ShopInfoEntity>): Promise<number> {
        const shopInfo = await this.repo.save(data);
        return shopInfo.id;
    }

    async update(id: number, data: Partial<ShopInfoEntity>): Promise<void> {
        await this.repo.update(id, data);
    }

    async delete(id: number): Promise<void> {
        await this.repo.delete(id);
    }

    async softDelete(id: number): Promise<void> {
        await this.repo.softDelete(id);
    }

    async findActiveShopInfos(): Promise<ShopInfoEntity[]> {
        return this.repo.find({
            where: { shopStatus: 'active' },
            select: {
                id: true,
                shopKey: true,
                shopCode: true,
                shopName: true,
                shopAddress: true,
                shopContactInfo: true,
                shopMobilePhone: true,
                shopEmail: true,
                shopLatitude: true,
                shopLongitude: true,
                shopStatus: true,
                shopSystemName: true,
                shopUploadFile: true,
                shopTaxName: true,
                shopTaxId: true,
                shopTaxAddress: true,
                shopBankAccount: true,
                shopBankAccountNumber: true,
                shopBankName: true,
                shopBankBranch: true,
                createdAt: true,
                updatedAt: true,
                createdBy: true,
                updatedBy: true
            },
        });
    }

    async findBySystemName(shopSystemName: string): Promise<ShopInfoEntity | null> {
        return this.findOneShopInfo({ shopSystemName });
    }

    async checkShopCodeExists(shopCode: string): Promise<boolean> {
        const count = await this.repo.count({ where: { shopCode } });
        return count > 0;
    }

    async checkShopKeyExists(shopKey: string): Promise<boolean> {
        const count = await this.repo.count({ where: { shopKey } });
        return count > 0;
    }
}
