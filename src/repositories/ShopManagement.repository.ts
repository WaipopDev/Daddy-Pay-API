import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, FindOptionsWhere, IsNull } from 'typeorm';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';

import { ShopManagementEntity } from 'src/models/entities/ShopManagement.entity';
import { ResponseShopManagementListDto, SortDto } from '../shop-management/dto/shop-management.dto';
import { PaginationDto } from 'src/constants/pagination.constant';
import { KeyGeneratorService } from 'src/utility/key-generator.service';

export class ShopManagementRepository {
    constructor(@InjectEntityManager() private readonly db: EntityManager) { }
    
    private get repo() {
        return this.db.getRepository(ShopManagementEntity);
    }

    private async findOneShopManagement(where: FindOptionsWhere<ShopManagementEntity>) {
        return this.repo.findOne({
            where: where,
            select: {
                id: true,
                shopManagementKey: true,
                shopManagementName: true,
                shopManagementDescription: true,
                shopManagementMachineID: true,
                shopManagementIotID: true,
                shopManagementStatus: true,
                shopManagementStatusOnline: true,
                shopManagementIntervalTime: true,
                shopInfoID: true,
                machineInfoID: true,
                createdAt: true,
                createdBy: true,
                updatedAt: true,
                updatedBy: true,
                shopInfo: {
                    id: true,
                    shopKey: true,
                    shopName: true,
                    shopCode: true,
                },
                machineInfo: {
                    id: true,
                    machineKey: true,
                    machineType: true,
                    machineBrand: true,
                    machineModel: true,
                }
            },
            relations: {
                shopInfo: true,
                machineInfo: true
            }
        });
    }

    async findShopManagementByKey(shopManagementKey: string): Promise<ShopManagementEntity | null> {
        return this.findOneShopManagement({ shopManagementKey, deletedAt: IsNull() });
    }

    async findShopManagementById(id: number): Promise<ShopManagementEntity | null> {
        return this.findOneShopManagement({ id, deletedAt: IsNull() });
    }

    async findShopManagementByMachineId(shopManagementMachineID: string): Promise<ShopManagementEntity | null> {
        return this.findOneShopManagement({ shopManagementMachineID, deletedAt: IsNull() });
    }

    async findShopManagementByIotId(shopManagementIotID: string): Promise<ShopManagementEntity | null> {
        return this.findOneShopManagement({ shopManagementIotID, deletedAt: IsNull() });
    }

    async findAll(option: PaginationDto, sort: SortDto): Promise<Pagination<ShopManagementEntity>> {
        const queryBuilder = this.repo.createQueryBuilder('shopManagement');
        
        queryBuilder.select([
            'shopManagement.id',
            'shopManagement.shopManagementKey',
            'shopManagement.shopManagementName',
            'shopManagement.shopManagementDescription',
            'shopManagement.shopManagementMachineID',
            'shopManagement.shopManagementIotID',
            'shopManagement.shopManagementStatus',
            'shopManagement.shopManagementStatusOnline',
            'shopManagement.shopManagementIntervalTime',
            'shopManagement.shopInfoID',
            'shopManagement.machineInfoID',
            'shopManagement.createdAt',
            'shopManagement.updatedAt',
            'shopManagement.createdBy',
            'shopManagement.updatedBy',
            'shopInfo.id',
            'shopInfo.shopKey',
            'shopInfo.shopName',
            'shopInfo.shopCode',
            'machineInfo.id',
            'machineInfo.machineKey',
            'machineInfo.machineType',
            'machineInfo.machineBrand',
            'machineInfo.machineModel',
        ]);

        queryBuilder.leftJoin('shopManagement.shopInfo', 'shopInfo');
        queryBuilder.leftJoin('shopManagement.machineInfo', 'machineInfo');

        queryBuilder.where('shopManagement.deletedAt IS NULL');

        // Apply sorting
        if (sort.column && sort.sort) {
            queryBuilder.orderBy(`shopManagement.${sort.column}`, sort.sort);
        }

        const paginationOptions: IPaginationOptions = {
            page: Number(option.page) || 1,
            limit: Number(option.limit) || 10,
        };

        return paginate<ShopManagementEntity>(queryBuilder, paginationOptions);
    }

    async findById(id: number): Promise<ShopManagementEntity | null> {
        return this.repo.findOne({ 
            where: { id, deletedAt: IsNull() },
            relations: ['shopInfo', 'machineInfo', 'programInfo']
        });
    }

    async createShopManagement(data: Partial<ShopManagementEntity>): Promise<ShopManagementEntity> {
        const shopManagement = this.repo.create(data);
        return this.repo.save(shopManagement);
    }

    async updateShopManagement(id: number, data: Partial<ShopManagementEntity>): Promise<void> {
        await this.repo.update(id, data);
    }

    async deleteShopManagement(id: number): Promise<void> {
        await this.repo.delete(id);
    }

    async softDeleteShopManagement(id: number): Promise<void> {
        await this.repo.softDelete(id);
    }

    async findActiveShopManagements(): Promise<ShopManagementEntity[]> {
        return this.repo.find({
            where: { shopManagementStatus: 'active', deletedAt: IsNull() },
            relations: ['shopInfo', 'machineInfo', 'programInfo'],
            select: {
                id: true,
                shopManagementKey: true,
                shopManagementName: true,
                shopManagementDescription: true,
                shopManagementMachineID: true,
                shopManagementIotID: true,
                shopManagementStatus: true,
                shopManagementStatusOnline: true,
                shopManagementIntervalTime: true,
                shopInfoID: true,
                machineInfoID: true,
                createdAt: true,
                updatedAt: true,
                createdBy: true,
                updatedBy: true
            },
        });
    }

    async checkShopManagementKeyExists(shopManagementKey: string): Promise<boolean> {
        const count = await this.repo.count({ where: { shopManagementKey, deletedAt: IsNull() } });
        return count > 0;
    }

    async checkShopManagementMachineIdExists(shopManagementMachineID: string): Promise<boolean> {
        const count = await this.repo.count({ where: { shopManagementMachineID, deletedAt: IsNull() } });
        return count > 0;
    }

    async checkShopManagementIotIdExists(shopManagementIotID: string): Promise<boolean> {
        const count = await this.repo.count({ where: { shopManagementIotID, deletedAt: IsNull() } });
        return count > 0;
    }

    async generateUniqueShopManagementKey(): Promise<string> {
        let shopManagementKey = '';
        let isUnique = false;

        while (!isUnique) {
            shopManagementKey = `shop_m_${KeyGeneratorService.generateRandomKey(10)}`;
            isUnique = !(await this.checkShopManagementKeyExists(shopManagementKey));
        }

        return shopManagementKey;
    }

    async findList(): Promise<ResponseShopManagementListDto[]> {
        return this.repo.find({
            where: { shopManagementStatus: 'active', deletedAt: IsNull() },
            order: { shopManagementName: 'ASC' },
            select: {
                id: true,
                shopManagementName: true,
            },
        });
    }
}
