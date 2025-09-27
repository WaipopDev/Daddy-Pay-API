import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, FindOptionsWhere, In, IsNull } from 'typeorm';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';

import { ShopInfoEntity } from 'src/models/entities/ShopInfo.entity';
import { ResponseShopInfoListDto, SortDto } from 'src/shop-info/dto/shoo-info.dto';
import { PaginationDto } from 'src/constants/pagination.constant';

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


    async findAll(option: PaginationDto, sort: SortDto): Promise<Pagination<ShopInfoEntity>> {
        const queryBuilder = this.repo.createQueryBuilder('shopInfo');
        
        queryBuilder.select([
            'shopInfo.id',
            'shopInfo.shopKey',
            'shopInfo.shopCode',
            'shopInfo.shopName',
            'shopInfo.shopAddress',
            'shopInfo.shopContactInfo',
            'shopInfo.shopMobilePhone',
            'shopInfo.shopEmail',
            'shopInfo.shopLatitude',
            'shopInfo.shopLongitude',
            'shopInfo.shopStatus',
            'shopInfo.shopSystemName',
            'shopInfo.shopUploadFile',
            'shopInfo.shopTaxName',
            'shopInfo.shopTaxId',
            'shopInfo.shopTaxAddress',
            'shopInfo.shopBankAccount',
            'shopInfo.shopBankAccountNumber',
            'shopInfo.shopBankName',
            'shopInfo.shopBankBranch',
            'shopInfo.createdAt',
            'shopInfo.updatedAt',
            'shopInfo.createdBy',
            'shopInfo.updatedBy'
        ]);

        queryBuilder.where('shopInfo.deletedAt IS NULL');
        // Apply sorting
        if (sort.column && sort.sort) {
            queryBuilder.orderBy(`shopInfo.${sort.column}`, sort.sort);
        }

        const paginationOptions: IPaginationOptions = {
            page: Number(option.page) || 1,
            limit: Number(option.limit) || 10,
        };

        return paginate<ShopInfoEntity>(queryBuilder, paginationOptions);
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


    async findList(permissions: number[] = []): Promise<ResponseShopInfoListDto[]> {
        const baseQuery = {
            order: { shopName: 'ASC' as const },
            select: {
                id: true,
                shopName: true,
            },
        };
        
        const whereClause: FindOptionsWhere<ShopInfoEntity> = {
            shopStatus: 'active',
            deletedAt: IsNull(),
        };
        
        if (permissions.length > 0) {
            whereClause.id = In(permissions);
        }
        
        return this.repo.find({
            ...baseQuery,
            where: whereClause,
        });
    }

    async findAllWithDto(option: PaginationDto, sort: SortDto): Promise<Pagination<ResponseShopInfoListDto>> {
        const queryBuilder = this.repo.createQueryBuilder('shopInfo');
        
        queryBuilder.select([
            'shopInfo.id',
            'shopInfo.shopKey',
            'shopInfo.shopCode',
            'shopInfo.shopName',
            'shopInfo.shopAddress',
            'shopInfo.shopContactInfo',
            'shopInfo.shopMobilePhone',
            'shopInfo.shopEmail',
            'shopInfo.shopLatitude',
            'shopInfo.shopLongitude',
            'shopInfo.shopStatus',
            'shopInfo.shopSystemName',
            'shopInfo.shopUploadFile',
            'shopInfo.shopTaxName',
            'shopInfo.shopTaxId',
            'shopInfo.shopTaxAddress',
            'shopInfo.shopBankAccount',
            'shopInfo.shopBankAccountNumber',
            'shopInfo.shopBankName',
            'shopInfo.shopBankBranch',
            'shopInfo.createdAt',
            'shopInfo.updatedAt',
            'shopInfo.createdBy',
            'shopInfo.updatedBy'
        ]);

        queryBuilder.where('shopInfo.deletedAt IS NULL');
        
        // Apply sorting
        if (sort.column && sort.sort) {
            queryBuilder.orderBy(`shopInfo.${sort.column}`, sort.sort);
        }

        const paginationOptions: IPaginationOptions = {
            page: Number(option.page) || 1,
            limit: Number(option.limit) || 10,
        };

        // ใช้ paginate และแปลงผลลัพธ์เป็น DTO
        const result = await paginate<ShopInfoEntity>(queryBuilder, paginationOptions);
        
        // Transform items to DTO format (ID จะถูกเข้ารหัสโดย @EncodeId decorator)
        const transformedItems = result.items.map(item => ({
            id: item.id, // จะถูกเข้ารหัสโดย @EncodeId ใน DTO
            shopKey: item.shopKey,
            shopCode: item.shopCode,
            shopName: item.shopName,
            shopAddress: item.shopAddress,
            shopContactInfo: item.shopContactInfo,
            shopMobilePhone: item.shopMobilePhone,
            shopEmail: item.shopEmail,
            shopLatitude: item.shopLatitude,
            shopLongitude: item.shopLongitude,
            shopStatus: item.shopStatus,
            shopSystemName: item.shopSystemName,
            shopUploadFile: item.shopUploadFile,
            shopTaxName: item.shopTaxName,
            shopTaxId: item.shopTaxId,
            shopTaxAddress: item.shopTaxAddress,
            shopBankAccount: item.shopBankAccount,
            shopBankAccountNumber: item.shopBankAccountNumber,
            shopBankName: item.shopBankName,
            shopBankBranch: item.shopBankBranch,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            createdBy: item.createdBy,
            updatedBy: item.updatedBy
        }));

        return {
            ...result,
            items: transformedItems
        };
    }
}
