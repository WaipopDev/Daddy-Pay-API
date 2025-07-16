import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, FindOptionsWhere, IsNull, Like } from 'typeorm';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';

import { MachineTransactionEntity } from 'src/models/entities/MachineTransaction.entity';
import { PaginationDto } from 'src/constants/pagination.constant';
import { KeyGeneratorService } from 'src/utility/key-generator.service';

export class MachineTransactionRepository {
    constructor(@InjectEntityManager() private readonly db: EntityManager) { }
    
    private get repo() {
        return this.db.getRepository(MachineTransactionEntity);
    }

    private async findOneMachineTransaction(where: FindOptionsWhere<MachineTransactionEntity>) {
        return this.repo.findOne({
            where: where,
            select: {
                id: true,
                shopInfoId: true,
                machineInfoId: true,
                programInfoId: true,
                machineProgramId: true,
                priceType: true,
                status: true,
                transactionId: true,
                transactionIot: true,
                errorMessage: true,
                price: true,
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
                },
                programInfo: {
                    id: true,
                    programKey: true,
                    programName: true,
                    programDescription: true,
                },
                machineProgram: {
                    id: true,
                    machineProgramKey: true,
                    machineProgramPrice: true,
                    machineProgramOperationTime: true,
                    machineProgramStatus: true,
                }
            },
            relations: {
                shopInfo: true,
                machineInfo: true,
                programInfo: true,
                machineProgram: true
            }
        });
    }

    async findMachineTransactionById(id: number): Promise<MachineTransactionEntity | null> {
        return this.findOneMachineTransaction({ id, deletedAt: IsNull() });
    }

    async findMachineTransactionByTransactionId(transactionId: string): Promise<MachineTransactionEntity | null> {
        return this.findOneMachineTransaction({ transactionId, deletedAt: IsNull() });
    }

    async findMachineTransactionsByStatus(status: string): Promise<MachineTransactionEntity[]> {
        return this.repo.find({
            where: { status, deletedAt: IsNull() },
            relations: ['shopInfo', 'machineInfo', 'programInfo', 'machineProgram'],
            order: { createdAt: 'DESC' }
        });
    }

    async findMachineTransactionsByShopInfoId(shopInfoId: number): Promise<MachineTransactionEntity[]> {
        return this.repo.find({
            where: { shopInfoId, deletedAt: IsNull() },
            relations: ['shopInfo', 'machineInfo', 'programInfo', 'machineProgram'],
            order: { createdAt: 'DESC' }
        });
    }

    async findMachineTransactionsByMachineInfoId(machineInfoId: number): Promise<MachineTransactionEntity[]> {
        return this.repo.find({
            where: { machineInfoId, deletedAt: IsNull() },
            relations: ['shopInfo', 'machineInfo', 'programInfo', 'machineProgram'],
            order: { createdAt: 'DESC' }
        });
    }

    async findAll(option: PaginationDto): Promise<Pagination<MachineTransactionEntity>> {
        const queryBuilder = this.repo.createQueryBuilder('machineTransaction');
        
        queryBuilder.select([
            'machineTransaction.id',
            'machineTransaction.shopInfoId',
            'machineTransaction.machineInfoId',
            'machineTransaction.programInfoId',
            'machineTransaction.machineProgramId',
            'machineTransaction.priceType',
            'machineTransaction.status',
            'machineTransaction.transactionId',
            'machineTransaction.transactionIot',
            'machineTransaction.errorMessage',
            'machineTransaction.price',
            'machineTransaction.createdAt',
            'machineTransaction.updatedAt',
            'machineTransaction.createdBy',
            'machineTransaction.updatedBy',
            'shopInfo.id',
            'shopInfo.shopKey',
            'shopInfo.shopName',
            'shopInfo.shopCode',
            'machineInfo.id',
            'machineInfo.machineKey',
            'machineInfo.machineType',
            'machineInfo.machineBrand',
            'machineInfo.machineModel',
            'programInfo.id',
            'programInfo.programKey',
            'programInfo.programName',
            'programInfo.programDescription',
            'machineProgram.id',
            'machineProgram.machineProgramKey',
            'machineProgram.machineProgramPrice',
            'machineProgram.machineProgramOperationTime',
            'machineProgram.machineProgramStatus',
        ]);

        queryBuilder.leftJoin('machineTransaction.shopInfo', 'shopInfo');
        queryBuilder.leftJoin('machineTransaction.machineInfo', 'machineInfo');
        queryBuilder.leftJoin('machineTransaction.programInfo', 'programInfo');
        queryBuilder.leftJoin('machineTransaction.machineProgram', 'machineProgram');

        queryBuilder.where('machineTransaction.deletedAt IS NULL');
        queryBuilder.orderBy('machineTransaction.createdAt', 'DESC');

        const paginationOptions: IPaginationOptions = {
            page: Number(option.page) || 1,
            limit: Number(option.limit) || 10,
        };

        return paginate<MachineTransactionEntity>(queryBuilder, paginationOptions);
    }

    async createMachineTransaction(data: Partial<MachineTransactionEntity>): Promise<MachineTransactionEntity> {
        const machineTransaction = this.repo.create(data);
        return this.repo.save(machineTransaction);
    }

    async updateMachineTransaction(id: number, data: Partial<MachineTransactionEntity>): Promise<void> {
        await this.repo.update(id, data);
    }

    async updateMachineTransactionStatus(id: number, status: string): Promise<void> {
        await this.repo.update(id, { status, updatedAt: new Date() });
    }

    async updateMachineTransactionByTransactionId(transactionId: string, data: Partial<MachineTransactionEntity>): Promise<void> {
        await this.repo.update({ transactionId }, data);
    }

    async deleteMachineTransaction(id: number): Promise<void> {
        await this.repo.delete(id);
    }

    async softDeleteMachineTransaction(id: number): Promise<void> {
        await this.repo.softDelete(id);
    }

    async findPendingTransactions(): Promise<MachineTransactionEntity[]> {
        return this.repo.find({
            where: { status: 'standby', deletedAt: IsNull() },
            relations: ['shopInfo', 'machineInfo', 'programInfo', 'machineProgram'],
            order: { createdAt: 'ASC' }
        });
    }

    async findTransactionsByDateRange(startDate: Date, endDate: Date): Promise<MachineTransactionEntity[]> {
        const queryBuilder = this.repo.createQueryBuilder('machineTransaction');
        
        queryBuilder
            .where('machineTransaction.deletedAt IS NULL')
            .andWhere('machineTransaction.createdAt >= :startDate', { startDate })
            .andWhere('machineTransaction.createdAt <= :endDate', { endDate })
            .leftJoinAndSelect('machineTransaction.shopInfo', 'shopInfo')
            .leftJoinAndSelect('machineTransaction.machineInfo', 'machineInfo')
            .leftJoinAndSelect('machineTransaction.programInfo', 'programInfo')
            .leftJoinAndSelect('machineTransaction.machineProgram', 'machineProgram')
            .orderBy('machineTransaction.createdAt', 'DESC');

        return queryBuilder.getMany();
    }

    async generateUniqueTransactionId(): Promise<string> {
        let transactionId = '';
        let isUnique = false;

        while (!isUnique) {
            transactionId = `TXN_${KeyGeneratorService.generateRandomKey(12)}`;
            const existing = await this.repo.count({ where: { transactionId, deletedAt: IsNull() } });
            isUnique = existing === 0;
        }

        return transactionId;
    }

    async getTransactionSummaryByStatus(): Promise<{ status: string; count: number; totalPrice: number }[]> {
        const result = await this.repo
            .createQueryBuilder('machineTransaction')
            .select('machineTransaction.status', 'status')
            .addSelect('COUNT(machineTransaction.id)', 'count')
            .addSelect('SUM(machineTransaction.price)', 'totalPrice')
            .where('machineTransaction.deletedAt IS NULL')
            .groupBy('machineTransaction.status')
            .getRawMany();

        return result.map(item => ({
            status: item.status,
            count: parseInt(item.count),
            totalPrice: parseFloat(item.totalPrice) || 0
        }));
    }
}
