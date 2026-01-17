import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, FindOptionsWhere, IsNull, Like, Not } from 'typeorm';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';

import { ShopManagementEntity } from 'src/models/entities/ShopManagement.entity';
import { ResponseShopManagementListDto, SortDto, ResponseMachineProgramDto } from '../shop-management/dto/shop-management.dto';
import { PaginationDto } from 'src/constants/pagination.constant';
import { KeyGeneratorService } from 'src/utility/key-generator.service';
import { MachineProgramEntity } from 'src/models/entities/MachineProgram.entity';

export class ShopManagementRepository {
    constructor(@InjectEntityManager() private readonly db: EntityManager) { }

    private get repo() {
        return this.db.getRepository(ShopManagementEntity);
    }

    private get repoMachineProgram() {
        return this.db.getRepository(MachineProgramEntity);
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

    async findAll(option: PaginationDto, sort: SortDto, query: { shopId?: string }): Promise<Pagination<ShopManagementEntity>> {
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
        if (query.shopId) {
            queryBuilder.where('shopManagement.shopInfoID = :shopId', { shopId: query.shopId });
        }
        queryBuilder.orderBy('shopInfo.shopName', 'ASC');
        const paginationOptions: IPaginationOptions = {
            page: Number(option.page) || 1,
            limit: Number(option.limit) || 10,
        };

        return paginate<ShopManagementEntity>(queryBuilder, paginationOptions);
    }

    async findById(id: number): Promise<ShopManagementEntity | null> {
        return this.repo.findOne({
            where: { id, deletedAt: IsNull() },
            relations: ['shopInfo', 'machineInfo']
        });
    }

    async findByIdIoT(idIoT: string): Promise<ShopManagementEntity | null> {

        return this.repo.findOne({
            where: {
                shopManagementIotID: Like(`%${idIoT}`),
                deletedAt: IsNull()
            },
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
                status: true,
                errorMessage: true,
                lastConnect: true,

            }
        });

    }

    async findProgramByIdIoT(idIoT: string): Promise<{ machineProgram: ResponseMachineProgramDto[], shopManagement: ShopManagementEntity | null }> {

        const shopManagement = await this.repo.findOne({
            where: {
                shopManagementIotID: Like(`%${idIoT}`),
                deletedAt: IsNull()
            },
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

            }
        });
        if (!shopManagement) {
            return { machineProgram: [], shopManagement: null };
        }
        const machineProgram = await this.repoMachineProgram.find({
            where: {
                machineInfoId: shopManagement.machineInfoID,
                shopInfoId: shopManagement.shopInfoID,
                machineProgramStatus: 'active',
                deletedAt: IsNull()
            },
            select: {
                id: true,
                machineProgramKey: true,
                machineProgramPrice: true,
                machineProgramOperationTime: true,
                machineProgramStatus: true,
                shopInfoId: true,
                machineInfoId: true,
                programInfoId: true,
                sort: true,
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
                },
                programInfo: {
                    id: true,
                    programKey: true,
                    programName: true,
                    programDescription: true,
                }
            },
            order: {
                sort: 'ASC'
            },
            relations: ['shopInfo', 'machineInfo', 'programInfo']
        });
        return { machineProgram, shopManagement };
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

    async findSoftDeletedByMachineId(shopManagementMachineID: string): Promise<ShopManagementEntity | null> {
        return this.repo.findOne({
            where: { shopManagementMachineID, deletedAt: Not(IsNull()) },
            withDeleted: true
        });
    }

    async findSoftDeletedByIotId(shopManagementIotID: string): Promise<ShopManagementEntity | null> {
        return this.repo.findOne({
            where: { shopManagementIotID, deletedAt: Not(IsNull()) },
            withDeleted: true
        });
    }

    async updateSoftDeletedUniqueValues(id: number, machineId?: string, iotId?: string): Promise<void> {
        const updateData: Partial<ShopManagementEntity> = {};
        const timestamp = Date.now();
        const suffix = `_deleted_${timestamp}`;
        const maxLength = 255;
        
        if (machineId) {
            // Truncate original value if needed to ensure total length doesn't exceed 255
            const maxOriginalLength = maxLength - suffix.length;
            const truncatedMachineId = machineId.length > maxOriginalLength 
                ? machineId.substring(0, maxOriginalLength) 
                : machineId;
            updateData.shopManagementMachineID = `${truncatedMachineId}${suffix}`;
        }
        
        if (iotId) {
            // Truncate original value if needed to ensure total length doesn't exceed 255
            const maxOriginalLength = maxLength - suffix.length;
            const truncatedIotId = iotId.length > maxOriginalLength 
                ? iotId.substring(0, maxOriginalLength) 
                : iotId;
            updateData.shopManagementIotID = `${truncatedIotId}${suffix}`;
        }
        
        if (Object.keys(updateData).length > 0) {
            await this.repo.update(id, updateData);
        }
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
