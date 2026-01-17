import { Injectable, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { CreateShopManagementDto } from './dto/create-shop-management.dto';
import { UpdateShopManagementDto } from './dto/update-shop-management.dto';
import { ResponseShopManagementDto, ResponseShopManagementListDto, QueryShopManagementDto, ShopManagementPaginationDto } from './dto/shop-management.dto';
import { ShopManagementRepository } from 'src/repositories/ShopManagement.repository';
import { ShopInfoRepository } from 'src/repositories/ShopInfo.repository';
import { MachineInfoRepository } from 'src/repositories/MachineInfo.repository';
import { IdEncoderService } from 'src/utility/id-encoder.service';

@Injectable()
export class ShopManagementService {
    constructor(
        private readonly shopManagementRepository: ShopManagementRepository,
        private readonly shopInfoRepository: ShopInfoRepository,
        private readonly machineInfoRepository: MachineInfoRepository,
    ) { }

    async create(createShopManagementDto: CreateShopManagementDto, createdBy: number): Promise<ResponseShopManagementDto> {
        // Decode IDs
        const shopInfoId = IdEncoderService.decode(createShopManagementDto.shopId);
        const machineInfoId = IdEncoderService.decode(createShopManagementDto.machineId);

        // Verify shop exists
        const shopInfo = await this.shopInfoRepository.findById(shopInfoId);
        if (!shopInfo) {
            throw new UnauthorizedException('Shop not found');
        }

        // Verify machine exists
        const machineInfo = await this.machineInfoRepository.findMachineInfoById(machineInfoId);
        if (!machineInfo) {
            throw new UnauthorizedException('Machine not found');
        }


        // Check if machine ID already exists (non-deleted)
        const existingMachineId = await this.shopManagementRepository.checkShopManagementMachineIdExists(createShopManagementDto.shopManagementMachineID);
        if (existingMachineId) {
            throw new ConflictException('Shop management machine ID already exists');
        }

        // Check if IoT ID already exists (non-deleted)
        const existingIotId = await this.shopManagementRepository.checkShopManagementIotIdExists(createShopManagementDto.shopManagementIotID);
        if (existingIotId) {
            throw new ConflictException('Shop management IoT ID already exists');
        }

        // Check for soft-deleted records with the same unique values and update their unique values
        // This prevents unique constraint violations when creating new records after soft delete
        // Instead of hard deleting, we change the unique values of soft-deleted records
        const softDeletedMachineId = await this.shopManagementRepository.findSoftDeletedByMachineId(createShopManagementDto.shopManagementMachineID);
        const softDeletedIotId = await this.shopManagementRepository.findSoftDeletedByIotId(createShopManagementDto.shopManagementIotID);
        
        // Collect records to update (avoid updating the same record twice)
        const recordsToUpdate = new Map<number, { machineId?: string; iotId?: string }>();
        
        if (softDeletedMachineId) {
            const existing = recordsToUpdate.get(softDeletedMachineId.id) || {};
            existing.machineId = createShopManagementDto.shopManagementMachineID;
            recordsToUpdate.set(softDeletedMachineId.id, existing);
        }
        
        if (softDeletedIotId) {
            const existing = recordsToUpdate.get(softDeletedIotId.id) || {};
            existing.iotId = createShopManagementDto.shopManagementIotID;
            recordsToUpdate.set(softDeletedIotId.id, existing);
        }
        
        // Update unique values of soft-deleted records to make room for new records
        for (const [id, values] of recordsToUpdate.entries()) {
            await this.shopManagementRepository.updateSoftDeletedUniqueValues(
                id,
                values.machineId,
                values.iotId
            );
        }

        // Generate unique shop management key
        const shopManagementKey = await this.shopManagementRepository.generateUniqueShopManagementKey();

        // Create shop management
        const shopManagementData = {
            shopManagementKey,
            shopInfoID: shopInfoId,
            machineInfoID: machineInfoId,
            shopManagementName: createShopManagementDto.shopManagementName,
            shopManagementDescription: createShopManagementDto.shopManagementDescription,
            shopManagementMachineID: createShopManagementDto.shopManagementMachineID,
            shopManagementIotID: createShopManagementDto.shopManagementIotID,
            shopManagementStatus: createShopManagementDto.shopManagementStatus || 'active',
            shopManagementStatusOnline: createShopManagementDto.shopManagementStatusOnline || 'active',
            shopManagementIntervalTime: createShopManagementDto.shopManagementIntervalTime,
            createdBy,
            updatedBy: createdBy,
        };

        const shopManagement = await this.shopManagementRepository.createShopManagement(shopManagementData);

        // Fetch the complete shop management with relations
        const completeShopManagement = await this.shopManagementRepository.findShopManagementById(shopManagement.id);

        return plainToInstance(ResponseShopManagementDto, completeShopManagement, {
            excludeExtraneousValues: true
        });
    }

    async findAll(query: QueryShopManagementDto): Promise<ShopManagementPaginationDto> {
        const { page = 1, limit = 10, shopId: encodedShopId, machineId, programId, ...sortOptions } = query;
        const shopId = encodedShopId ? IdEncoderService.decode(encodedShopId) : '';
        const paginationOptions = { page, limit };
        const result = await this.shopManagementRepository.findAll(paginationOptions, sortOptions, { shopId: shopId.toString() });

        const transformedItems = result.items.map(item =>
            plainToInstance(ResponseShopManagementDto, item, {
                excludeExtraneousValues: true
            })
        );

        return {
            items: transformedItems,
            meta: {
                totalItems: result.meta.totalItems || 0,
                itemCount: result.meta.itemCount || 0,
                itemsPerPage: result.meta.itemsPerPage || limit,
                totalPages: result.meta.totalPages || 0,
                currentPage: result.meta.currentPage || page,
            }
        };
    }

    async findOne(id: number): Promise<ResponseShopManagementDto> {
        const shopManagement = await this.shopManagementRepository.findShopManagementById(id);

        if (!shopManagement) {
            throw new NotFoundException('Shop management not found');
        }

        return plainToInstance(ResponseShopManagementDto, shopManagement, {
            excludeExtraneousValues: true
        });
    }

    async update(id: number, updateShopManagementDto: UpdateShopManagementDto, updatedBy: number): Promise<ResponseShopManagementDto> {
        const existingShopManagement = await this.shopManagementRepository.findShopManagementById(id);
        if (!existingShopManagement) {
            throw new NotFoundException('Shop management not found');
        }

        const updateData: any = {
            updatedBy,
        };

        // Handle shop ID update
        if (updateShopManagementDto.shopId) {
            const shopInfoId = IdEncoderService.decode(updateShopManagementDto.shopId);
            const shopInfo = await this.shopInfoRepository.findById(shopInfoId);
            if (!shopInfo) {
                throw new NotFoundException('Shop not found');
            }
            updateData.shopInfoID = shopInfoId;
        }

        // Handle machine ID update
        if (updateShopManagementDto.machineId) {
            const machineInfoId = IdEncoderService.decode(updateShopManagementDto.machineId);
            const machineInfo = await this.machineInfoRepository.findMachineInfoById(machineInfoId);
            if (!machineInfo) {
                throw new NotFoundException('Machine not found');
            }
            updateData.machineInfoID = machineInfoId;
        }


        // Check machine ID uniqueness if updating
        if (updateShopManagementDto.shopManagementMachineID &&
            updateShopManagementDto.shopManagementMachineID !== existingShopManagement.shopManagementMachineID) {
            const existingMachineId = await this.shopManagementRepository.checkShopManagementMachineIdExists(updateShopManagementDto.shopManagementMachineID);
            if (existingMachineId) {
                throw new ConflictException('Shop management machine ID already exists');
            }
            updateData.shopManagementMachineID = updateShopManagementDto.shopManagementMachineID;
        }

        // Check IoT ID uniqueness if updating
        if (updateShopManagementDto.shopManagementIotID &&
            updateShopManagementDto.shopManagementIotID !== existingShopManagement.shopManagementIotID) {
            const existingIotId = await this.shopManagementRepository.checkShopManagementIotIdExists(updateShopManagementDto.shopManagementIotID);
            if (existingIotId) {
                throw new ConflictException('Shop management IoT ID already exists');
            }
            updateData.shopManagementIotID = updateShopManagementDto.shopManagementIotID;
        }

        // Update other fields
        if (updateShopManagementDto.shopManagementName !== undefined) {
            updateData.shopManagementName = updateShopManagementDto.shopManagementName;
        }
        if (updateShopManagementDto.shopManagementDescription !== undefined) {
            updateData.shopManagementDescription = updateShopManagementDto.shopManagementDescription;
        }
        if (updateShopManagementDto.shopManagementStatus !== undefined) {
            updateData.shopManagementStatus = updateShopManagementDto.shopManagementStatus;
        }
        if (updateShopManagementDto.shopManagementStatusOnline !== undefined) {
            updateData.shopManagementStatusOnline = updateShopManagementDto.shopManagementStatusOnline;
        }
        if (updateShopManagementDto.shopManagementIntervalTime !== undefined) {
            updateData.shopManagementIntervalTime = updateShopManagementDto.shopManagementIntervalTime;
        }

        await this.shopManagementRepository.updateShopManagement(id, updateData);

        // Fetch updated shop management
        const updatedShopManagement = await this.shopManagementRepository.findShopManagementById(id);

        return plainToInstance(ResponseShopManagementDto, updatedShopManagement, {
            excludeExtraneousValues: true
        });
    }

    async remove(id: number): Promise<void> {
        const shopManagement = await this.shopManagementRepository.findShopManagementById(id);
        if (!shopManagement) {
            throw new NotFoundException('Shop management not found');
        }

        await this.shopManagementRepository.softDeleteShopManagement(id);
        // await this.shopManagementRepository.deleteShopManagement(id);
    }

    async findList(): Promise<ResponseShopManagementListDto[]> {
        const result = await this.shopManagementRepository.findList();

        return result.map(item =>
            plainToInstance(ResponseShopManagementListDto, item, {
                excludeExtraneousValues: true
            })
        );
    }

    async findByKey(shopManagementKey: string): Promise<ResponseShopManagementDto | null> {
        const shopManagement = await this.shopManagementRepository.findShopManagementByKey(shopManagementKey);

        if (!shopManagement) {
            return null;
        }

        return plainToInstance(ResponseShopManagementDto, shopManagement, {
            excludeExtraneousValues: true
        });
    }

    async findByMachineId(shopManagementMachineID: string): Promise<ResponseShopManagementDto | null> {
        const shopManagement = await this.shopManagementRepository.findShopManagementByMachineId(shopManagementMachineID);

        if (!shopManagement) {
            return null;
        }

        return plainToInstance(ResponseShopManagementDto, shopManagement, {
            excludeExtraneousValues: true
        });
    }

    async findByIotId(shopManagementIotID: string): Promise<ResponseShopManagementDto | null> {
        const shopManagement = await this.shopManagementRepository.findShopManagementByIotId(shopManagementIotID);

        if (!shopManagement) {
            return null;
        }

        return plainToInstance(ResponseShopManagementDto, shopManagement, {
            excludeExtraneousValues: true
        });
    }

    async findActiveShopManagements(): Promise<ResponseShopManagementDto[]> {
        const result = await this.shopManagementRepository.findActiveShopManagements();

        return result.map(item =>
            plainToInstance(ResponseShopManagementDto, item, {
                excludeExtraneousValues: true
            })
        );
    }
}
