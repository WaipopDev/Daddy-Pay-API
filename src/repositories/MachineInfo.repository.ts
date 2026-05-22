import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, FindOptionsWhere, IsNull } from 'typeorm';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';

import { MachineInfoEntity } from 'src/models/entities/MachineInfo.entity';
import { QueryMachineInfoDto } from 'src/machine-info/dto/machine-info.dto';
import { KeyGeneratorService } from 'src/utility/key-generator.service';

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

    async findAll(query: QueryMachineInfoDto): Promise<Pagination<MachineInfoEntity>> {
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

        if (query.machineType) {
            queryBuilder.andWhere('machineInfo.machineType ILIKE :machineType', {
                machineType: `%${query.machineType}%`,
            });
        }

        if (query.machineBrand) {
            queryBuilder.andWhere('machineInfo.machineBrand ILIKE :machineBrand', {
                machineBrand: `%${query.machineBrand}%`,
            });
        }

        if (query.machineModel) {
            queryBuilder.andWhere('machineInfo.machineModel ILIKE :machineModel', {
                machineModel: `%${query.machineModel}%`,
            });
        }

        if (query.column && query.sort) {
            queryBuilder.orderBy(`machineInfo.${query.column}`, query.sort);
        }

        const paginationOptions: IPaginationOptions = {
            page: Number(query.page || 1) || 1,
            limit: Number(query.limit || 10) || 10,
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
        const result = await this.repo.save(data);
        return result.id;
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

    async generateUniqueMachineKey(): Promise<string> {
        let counter = 1;

        while (true) {
            const machineKey = `MACHINE_${KeyGeneratorService.generateRandomKey(8)}_${counter.toString().padStart(3, '0')}`;

            const existingMachine = await this.findMachineInfoByKey(machineKey);
            if (!existingMachine) {
                return machineKey;
            }
            counter++;
        }
    }
}
