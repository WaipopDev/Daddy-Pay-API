import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, IsNull } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { MachineProgramEntity } from 'src/models/entities/MachineProgram.entity';
import { KeyGeneratorService } from 'src/utility/key-generator.service';
import { ProgramInfoEntity } from 'src/models/entities/ProgramInfo.entity';

@Injectable()
export class MachineProgramRepository {
    constructor(@InjectEntityManager() private readonly db: EntityManager) { }
    
    private get repo() {
        return this.db.getRepository(MachineProgramEntity);
    }

     private get repoProgramInfo() {
        return this.db.getRepository(ProgramInfoEntity);
    }

    async findByMachine(machineInfoId: number): Promise<ProgramInfoEntity[]> {
        return this.repoProgramInfo.find({
            where: { 
                machineInfoId, 
                deletedAt: IsNull() 
            },
            order: {
                programName: 'ASC'
            }
        });
    }

    async createMachineProgram(machineProgramData: Partial<MachineProgramEntity>): Promise<MachineProgramEntity> {
        try {
            const machineProgram = this.repo.create(machineProgramData);
            return await this.repo.save(machineProgram);
        } catch (error) {
            console.error("🚀 ~ MachineProgramRepository ~ createMachineProgram ~ error:", error);
            throw error;
        }
    }

    async findAll(idMachine: number, idShop: number): Promise<MachineProgramEntity[]> {
        return this.repo.find({
            where: { 
                machineInfoId: idMachine,
                shopInfoId: idShop,
                deletedAt: IsNull()
            },
            select: {
                id: true,
                machineProgramKey: true,
                machineProgramPrice: true,
                machineProgramOperationTime: true,
                machineProgramStatus: true,
                programInfo:{
                    id: true,
                    programName: true,
                    programDescription: true
                }
            },
            relations: {
                programInfo: true
            }
        });
    }

    async findMachineProgramById(id: number): Promise<MachineProgramEntity | null> {
        return this.repo.findOne({
            where: { id, deletedAt: IsNull() }
        });
    }

    async deleteMachineProgram(id: number, deletedBy: number): Promise<void> {
        await this.repo.update(
            { id },
            {
                deletedAt: new Date(),
                updatedBy: deletedBy,
                updatedAt: new Date(),
            }
        );
    }

    async isMachineProgramKeyUnique(machineProgramKey: string, excludeId?: number): Promise<boolean> {
        const query = this.repo.createQueryBuilder('mp')
            .where('mp.machineProgramKey = :machineProgramKey', { machineProgramKey })
            .andWhere('mp.deletedAt IS NULL');

        if (excludeId) {
            query.andWhere('mp.id != :excludeId', { excludeId });
        }

        const existingMachineProgram = await query.getOne();
        return !existingMachineProgram;
    }

    async generateUniqueMachineProgramKey(): Promise<string> {
        let isUnique = false;
        let machineProgramKey = '';
        
        while (!isUnique) {
            machineProgramKey = `MP-${KeyGeneratorService.generateRandomKey(8)}`;
            isUnique = await this.isMachineProgramKeyUnique(machineProgramKey);
        }

        return machineProgramKey;
    }
}