import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, FindOptionsWhere } from 'typeorm';
import { LangMainEntity } from 'src/models/entities/LangMain.entity';
import { LangListEntity } from 'src/models/entities/LangList.entity';
import { ResponseLanguageDto } from 'src/language/dto/language.dto';
import { MachineTransactionEntity } from 'src/models/entities/MachineTransaction.entity';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { ReportBranchIncomeDto } from 'src/report/dto/report.dto';

export class ReportRepository {
    constructor(
        @InjectEntityManager() private readonly db: EntityManager
    ) { }

    private get repo() {
        return this.db.getRepository(MachineTransactionEntity);
    }

    async findBranchIncome(query: ReportBranchIncomeDto) {
        const { startDate, endDate, page, limit } = query;
        const queryBuilder = this.repo.createQueryBuilder('machineTransaction');

        queryBuilder.select([
            'machineTransaction.id',
            'machineTransaction.shopInfoId',
            'machineTransaction.priceType',
            'machineTransaction.price',
            'machineTransaction.createdAt',
            'machineTransaction.transactionId',
            'machineTransaction.transactionIot',
        ]);
        queryBuilder.addSelect([
            'shopInfo.shopName',
            'machineInfo.machineType',
            'shopManagement.shopManagementName',
            'programInfo.programName',
        ]);

        queryBuilder.where('machineTransaction.deletedAt IS NULL');
        queryBuilder.andWhere('machineTransaction.createdAt >= :startDate', { startDate });
        queryBuilder.andWhere('machineTransaction.createdAt <= :endDate', { endDate });

        if (query.branchId) {
            queryBuilder.andWhere('machineTransaction.shopInfoId = :branchId', { branchId: query.branchId });
        }
        if (query.paymentType) {
            queryBuilder.andWhere('machineTransaction.priceType = :paymentType', { paymentType: query.paymentType });
        }
        if (query.machineName) {
            queryBuilder.andWhere('shopManagement.shopManagementName LIKE :machineName', { machineName: `%${query.machineName}%` });
        }
        if (query.programName) {
            queryBuilder.andWhere('programInfo.programName LIKE :programName', { programName: `%${query.programName}%` });
        }

        queryBuilder.innerJoin('machineTransaction.shopInfo', 'shopInfo');
        queryBuilder.innerJoin('machineTransaction.machineInfo', 'machineInfo');
        queryBuilder.innerJoin('machineTransaction.programInfo', 'programInfo');
        queryBuilder.innerJoin('machineTransaction.machineProgram', 'machineProgram');
        queryBuilder.innerJoin('machineTransaction.shopManagement', 'shopManagement');
        queryBuilder.orderBy('machineTransaction.createdAt', 'DESC');

        const paginationOptions: IPaginationOptions = {
            page: Number(page) || 1,
            limit: Number(limit) || 10,
        };
        return paginate<MachineTransactionEntity>(queryBuilder, paginationOptions);
    }

    async sumBranchIncome(query: ReportBranchIncomeDto) {
        const { startDate, endDate } = query;
        const queryBuilder = this.repo.createQueryBuilder('machineTransaction');
        queryBuilder.select('SUM(machineTransaction.price) as totalPrice');
        queryBuilder.where('machineTransaction.deletedAt IS NULL');

        if (query.branchId) {
            queryBuilder.andWhere('machineTransaction.shopInfoId = :branchId', { branchId: query.branchId });
        }
        if (query.paymentType) {
            queryBuilder.andWhere('machineTransaction.priceType = :paymentType', { paymentType: query.paymentType });
        }
        if (query.machineName) {
            queryBuilder.andWhere('shopManagement.shopManagementName LIKE :machineName', { machineName: `%${query.machineName}%` });
        }
        if (query.programName) {
            queryBuilder.andWhere('programInfo.programName LIKE :programName', { programName: `%${query.programName}%` });
        }

        queryBuilder.andWhere('machineTransaction.createdAt >= :startDate', { startDate });
        queryBuilder.andWhere('machineTransaction.createdAt <= :endDate', { endDate });
        queryBuilder.innerJoin('machineTransaction.shopInfo', 'shopInfo');
        queryBuilder.innerJoin('machineTransaction.machineInfo', 'machineInfo');
        queryBuilder.innerJoin('machineTransaction.programInfo', 'programInfo');
        queryBuilder.innerJoin('machineTransaction.machineProgram', 'machineProgram');
        queryBuilder.innerJoin('machineTransaction.shopManagement', 'shopManagement');
        return queryBuilder.getRawOne();
    }
}
