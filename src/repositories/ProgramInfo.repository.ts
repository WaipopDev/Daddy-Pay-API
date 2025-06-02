import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, FindOptionsWhere, IsNull } from 'typeorm';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';

import { ProgramInfoEntity } from 'src/models/entities/ProgramInfo.entity';
import { ResponseProgramInfoListDto, SortDto } from '../program-info/dto/program-info.dto';
import { PaginationDto } from 'src/constants/pagination.constant';
import { KeyGeneratorService } from 'src/utility/key-generator.service';

export class ProgramInfoRepository {
    constructor(@InjectEntityManager() private readonly db: EntityManager) { }
    
    private get repo() {
        return this.db.getRepository(ProgramInfoEntity);
    }

    private async findOneProgramInfo(where: FindOptionsWhere<ProgramInfoEntity>) {
        return this.repo.findOne({
            where: where,
            select: {
                id: true,
                programKey: true,
                machineInfoId: true,
                programName: true,
                programDescription: true,
                createdAt: true,
                createdBy: true,
                updatedAt: true,
                updatedBy: true,
                machineInfo: {
                    id: true,
                    machineKey: true,
                    machineType: true,
                    machineBrand: true,
                    machineModel: true,
                }
            },
            relations: {
                machineInfo: true,
            }
        });
    }

    async findProgramInfoByKey(programKey: string): Promise<ProgramInfoEntity | null> {
        return this.findOneProgramInfo({ programKey, deletedAt: IsNull() });
    }

    async findProgramInfoById(id: number): Promise<ProgramInfoEntity | null> {
        return this.findOneProgramInfo({ id, deletedAt: IsNull() });
    }

    async createProgramInfo(programInfoData: Partial<ProgramInfoEntity>): Promise<ProgramInfoEntity> {
        const programInfo = this.repo.create(programInfoData);
        return this.repo.save(programInfo);
    }

    async updateProgramInfo(id: number, updateData: Partial<ProgramInfoEntity>): Promise<void> {
        await this.repo.update({ id }, updateData);
    }

    async deleteProgramInfo(id: number, deletedBy: number): Promise<void> {
        await this.repo.update(
            { id },
            {
                deletedAt: new Date(),
                updatedBy: deletedBy,
                updatedAt: new Date(),
            }
        );
    }

    async findAllProgramInfo(options: IPaginationOptions, sort?: SortDto): Promise<Pagination<ResponseProgramInfoListDto>> {
        const queryBuilder = this.repo.createQueryBuilder('program_info')
            .leftJoinAndSelect('program_info.machineInfo', 'machine_info')
            .where('program_info.deleted_at IS NULL')
            .select([
                'program_info.id',
                'program_info.programKey',
                'program_info.machineInfoId', 
                'program_info.programName',
                'program_info.programDescription',
                'program_info.createdAt',
                'program_info.createdBy',
                'program_info.updatedAt',
                'program_info.updatedBy',
                'machine_info.id',
                'machine_info.machineKey',
                'machine_info.machineName',
            ]);

        // Apply sorting
        if (sort?.sortBy && sort?.sortOrder) {
            const validSortFields = ['programName', 'createdAt', 'updatedAt'];
            if (validSortFields.includes(sort.sortBy)) {
                queryBuilder.orderBy(`program_info.${sort.sortBy}`, sort.sortOrder.toUpperCase() as 'ASC' | 'DESC');
            }
        } else {
            queryBuilder.orderBy('program_info.createdAt', 'DESC');
        }

        return paginate<ProgramInfoEntity>(queryBuilder, options);
    }

    async findProgramInfoByMachineId(machineInfoId: number, options: IPaginationOptions): Promise<Pagination<ResponseProgramInfoListDto>> {
        const queryBuilder = this.repo.createQueryBuilder('program_info')
            .leftJoinAndSelect('program_info.machineInfo', 'machine_info')
            .where('program_info.deleted_at IS NULL')
            .andWhere('program_info.machineInfoId = :machineInfoId', { machineInfoId })
            .select([
                'program_info.id',
                'program_info.programKey',
                'program_info.machineInfoId',
                'program_info.programName', 
                'program_info.programDescription',
                'program_info.createdAt',
                'program_info.createdBy',
                'program_info.updatedAt',
                'program_info.updatedBy',
                'machine_info.id',
                'machine_info.machineKey',
                'machine_info.machineName',
            ])
            .orderBy('program_info.createdAt', 'DESC');

        return paginate<ProgramInfoEntity>(queryBuilder, options);
    }

    async isProgramKeyUnique(programKey: string, excludeId?: number): Promise<boolean> {
        const whereCondition: FindOptionsWhere<ProgramInfoEntity> = {
            programKey,
            deletedAt: IsNull()
        };

        if (excludeId) {
            whereCondition.id = excludeId;
        }

        const existingProgram = await this.repo.findOne({
            where: whereCondition,
            select: { id: true }
        });

        return !existingProgram;
    }

    async generateUniqueProgramKey(): Promise<string> {
        let counter = 1;

        while (true) {
            const programKey = `PROG_${KeyGeneratorService.generateRandomKey(8)}_${counter.toString().padStart(3, '0')}`;

            const existingProgram = await this.isProgramKeyUnique(programKey);
            if (!existingProgram) {
                return programKey;
            }
            counter++;
        }
    }
   
}
