import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, FindOptionsWhere, IsNull } from 'typeorm';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';

import { MachineInfoEntity } from 'src/models/entities/MachineInfo.entity';
import { ResponseMachineInfoListDto, SortDto } from 'src/machine-info/dto/machine-info.dto';
import { PaginationDto } from 'src/constants/pagination.constant';

export class MachineInfoRepository {
    constructor(@InjectEntityManager() private readonly db: EntityManager) { }
    
    private get repo() {
        return this.db.getRepository(MachineInfoEntity);
    }

    private async findOneMachineInfo(where: FindOptionsWhere<MachineInfoEntity>) {
        return this.repo.findOne({
            where: where,
            select: {
                id: true,
                machineKey: true,
                machineType: true,
                machineBrand: true,
                machineModel: true,
                machineDescription: true,
                machinePicturePath: true,
                createdAt: true,
                updatedAt: true,
                createdBy: true,
                updatedBy: true
            },
        });
    }

    async findMachineInfoByKey(machineKey: string): Promise<MachineInfoEntity | null> {
        return this.findOneMachineInfo({ machineKey });
    }
    
    async findMachineInfoById(id: number): Promise<MachineInfoEntity | null> {
        return this.findOneMachineInfo({ id });
    }

    async findAll(option: PaginationDto, sort: SortDto): Promise<Pagination<MachineInfoEntity>> {
        const queryBuilder = this.repo.createQueryBuilder('machineInfo');
        
        queryBuilder.select([
            'machineInfo.id',
            'machineInfo.machineKey',
            'machineInfo.machineType',
            'machineInfo.machineBrand',
            'machineInfo.machineModel',
            'machineInfo.machineDescription',
            'machineInfo.machinePicturePath',
            'machineInfo.createdAt',
            'machineInfo.updatedAt',
            'machineInfo.createdBy',
            'machineInfo.updatedBy'
        ]);

        queryBuilder.where('machineInfo.deletedAt IS NULL');
        
        // Apply sorting
        console.log('sort', sort)
        if (sort.column && sort.sort) {
            queryBuilder.orderBy(`machineInfo.${sort.column}`, sort.sort);
        }

        const paginationOptions: IPaginationOptions = {
            page: Number(option.page) || 1,
            limit: Number(option.limit) || 10,
        };

        return paginate<MachineInfoEntity>(queryBuilder, paginationOptions);
    }

    async findList(): Promise<MachineInfoEntity[]> {
        return this.repo.find({
            where: { deletedAt: IsNull() },
            select: {
                id: true,
                machineKey: true,
                machineType: true,
                machineBrand: true,
                machineModel: true,
                machineDescription: true,
                machinePicturePath: true,
                createdAt: true,
                updatedAt: true
            },
            order: { id: 'DESC' }
        });
    }

    async create(data: Partial<MachineInfoEntity>): Promise<number> {
        const result = await this.repo.insert(data);
        return result.identifiers[0].id;
    }

    async update(id: number, data: Partial<MachineInfoEntity>): Promise<void> {
        await this.repo.update(id, data);
    }

    async remove(id: number): Promise<void> {
        await this.repo.softDelete(id);
    }

    async findByKeyExcludingId(machineKey: string, excludeId: number): Promise<MachineInfoEntity | null> {
        const queryBuilder = this.repo.createQueryBuilder('machineInfo');
        queryBuilder.where('machineInfo.machineKey = :machineKey', { machineKey });
        queryBuilder.andWhere('machineInfo.id != :excludeId', { excludeId });
        queryBuilder.andWhere('machineInfo.deletedAt IS NULL');
        
        return queryBuilder.getOne();
    }

    
}
