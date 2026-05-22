import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, FindOptionsWhere, IsNull } from 'typeorm';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';

import { ProgramInfoEntity } from 'src/models/entities/ProgramInfo.entity';
import { QueryProgramInfoDto, ResponseProgramInfoListDto } from '../program-info/dto/program-info.dto';
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
        try {
            const programInfo = this.repo.create(programInfoData);
            return await this.repo.save(programInfo);
        } catch (error) {
            console.error("🚀 ~ ProgramInfoRepository ~ createProgramInfo ~ error:", error);
            throw error;
        }
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



    async findAllProgramInfo(
        query: QueryProgramInfoDto,
        machineInfoId?: number,
    ): Promise<Pagination<ResponseProgramInfoListDto>> {
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
                'machine_info.machineType',
                'machine_info.machineBrand',
            ]);

        if (machineInfoId) {
            queryBuilder.andWhere('program_info.machineInfoId = :machineInfoId', { machineInfoId });
        }

        if (query.programName) {
            queryBuilder.andWhere('program_info.programName ILIKE :programName', {
                programName: `%${query.programName}%`,
            });
        }

        if (query.machineType) {
            queryBuilder.andWhere('machine_info.machineType ILIKE :machineType', {
                machineType: `%${query.machineType}%`,
            });
        }

        if (query.machineBrand) {
            queryBuilder.andWhere('machine_info.machineBrand ILIKE :machineBrand', {
                machineBrand: `%${query.machineBrand}%`,
            });
        }

        if (query.column && query.sort) {
            queryBuilder.orderBy(`program_info.${query.column}`, query.sort);
        }

        const paginationOptions: IPaginationOptions = {
            page: Number(query.page || 1) || 1,
            limit: Number(query.limit || 10) || 10,
        };

        return paginate<ProgramInfoEntity>(queryBuilder, paginationOptions);
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

        return !existingProgram; // Returns true if NO existing program (unique)
    }

    async generateUniqueProgramKey(): Promise<string> {
        let counter = 1;

        while (true) {
            const programKey = `PROG_${KeyGeneratorService.generateRandomKey(8)}_${counter.toString().padStart(3, '0')}`;

            const isUnique = await this.isProgramKeyUnique(programKey);
            if (isUnique) {
                return programKey;
            }
            counter++;
        }
    }


}
