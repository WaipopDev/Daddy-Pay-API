import { InjectEntityManager } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { MachineTransactionEntity } from 'src/models/entities/MachineTransaction.entity';
import { EntityManager } from 'typeorm';
import { ShopManagementEntity } from 'src/models/entities/ShopManagement.entity';
import moment from 'moment';
import _ from 'lodash';

@Injectable()
export class DashboardRepository {
    private static readonly EFFECTIVE_PRICE_SQL = `CASE WHEN machineTransaction.price_type = 'force' THEN 0 ELSE machineTransaction.price END`;

    constructor(@InjectEntityManager() private readonly db: EntityManager) { }

    private get repoTransaction() {
        return this.db.getRepository(MachineTransactionEntity);
    }
    private get repoShopManagement() {
        return this.db.getRepository(ShopManagementEntity);
    }

    async findAllTotalSale(permissions: number[]) {
        const startOfDay = moment.tz('Asia/Bangkok').startOf('day').toDate();
        const endOfDay = moment.tz('Asia/Bangkok').endOf('day').toDate();

        const salesByDay = this.repoTransaction.createQueryBuilder('machineTransaction')
        salesByDay.select(`${DashboardRepository.EFFECTIVE_PRICE_SQL} as price`)
        salesByDay.where('machineTransaction.deletedAt IS NULL')
        salesByDay.andWhere('machineTransaction.createdAt >= :startDate', { startDate: startOfDay });
        salesByDay.andWhere('machineTransaction.createdAt <= :endDate', { endDate: endOfDay });
        if(permissions.length > 0){
            salesByDay.andWhere('machineTransaction.shopInfoId IN (:...permissions)', { permissions: permissions });
        }
        const totalSaleByDay = await salesByDay.getRawMany();
        const salesByWeek = this.repoTransaction.createQueryBuilder('machineTransaction')
        const startDateWeek = moment.tz('Asia/Bangkok').startOf('isoWeek').toDate();
        const endDateWeek = moment.tz('Asia/Bangkok').endOf('isoWeek').toDate();

        salesByWeek.select(`${DashboardRepository.EFFECTIVE_PRICE_SQL} as price`)
        salesByWeek.where('machineTransaction.deletedAt IS NULL')
        salesByWeek.andWhere('machineTransaction.createdAt >= :startDate', { startDate: startDateWeek });
        salesByWeek.andWhere('machineTransaction.createdAt <= :endDate', { endDate: endDateWeek });
        if(permissions.length > 0){
            salesByWeek.andWhere('machineTransaction.shopInfoId IN (:...permissions)', { permissions: permissions });
        }
        const totalSaleByWeek = await salesByWeek.getRawMany();

        const salesByMonth = this.repoTransaction.createQueryBuilder('machineTransaction')
        salesByMonth.select(`${DashboardRepository.EFFECTIVE_PRICE_SQL} as price`)
        salesByMonth.where('machineTransaction.deletedAt IS NULL')
        salesByMonth.andWhere('machineTransaction.createdAt >= :startDate', { startDate: moment(startOfDay).startOf('month').toDate() });
        salesByMonth.andWhere('machineTransaction.createdAt <= :endDate', { endDate: moment(endOfDay).endOf('month').toDate() });
        if(permissions.length > 0){
            salesByMonth.andWhere('machineTransaction.shopInfoId IN (:...permissions)', { permissions: permissions });
        }
        const totalSaleByMonth = await salesByMonth.getRawMany();
        
        const convertPricesToNumbers = (data: {price: string}[]) => data.map(item => ({ ...item, price: parseFloat(item.price) }));
        
        const totalSaleByDayNumeric = convertPricesToNumbers(totalSaleByDay);
        const totalSaleByWeekNumeric = convertPricesToNumbers(totalSaleByWeek);
        const totalSaleByMonthNumeric = convertPricesToNumbers(totalSaleByMonth);
        
        return {
            totalSaleByDay: _.sumBy(totalSaleByDayNumeric,'price'),
            totalSaleByWeek: _.sumBy(totalSaleByWeekNumeric, 'price'),
            totalSaleByMonth: _.sumBy(totalSaleByMonthNumeric, 'price'),
        };
    }

    async findByBranchTotalSale(branchId: number) {
        const startOfDay = moment.tz('Asia/Bangkok').startOf('day').toDate();
        const endOfDay = moment.tz('Asia/Bangkok').endOf('day').toDate();

        const salesByDay = this.repoTransaction.createQueryBuilder('machineTransaction')
        salesByDay.select(`${DashboardRepository.EFFECTIVE_PRICE_SQL} as price`)
        salesByDay.where('machineTransaction.deletedAt IS NULL')
        salesByDay.andWhere('machineTransaction.shopInfoId = :branchId', { branchId: branchId });
        salesByDay.andWhere('machineTransaction.createdAt >= :startDate', { startDate: startOfDay });
        salesByDay.andWhere('machineTransaction.createdAt <= :endDate', { endDate: endOfDay });
        const totalSaleByDay = await salesByDay.getRawMany();
        
        const salesByWeek = this.repoTransaction.createQueryBuilder('machineTransaction')
        const startDateWeek = moment.tz('Asia/Bangkok').startOf('isoWeek').toDate();
        const endDateWeek = moment.tz('Asia/Bangkok').endOf('isoWeek').toDate();

        salesByWeek.select(`${DashboardRepository.EFFECTIVE_PRICE_SQL} as price`)
        salesByWeek.where('machineTransaction.deletedAt IS NULL')
        salesByWeek.andWhere('machineTransaction.shopInfoId = :branchId', { branchId: branchId });
        salesByWeek.andWhere('machineTransaction.createdAt >= :startDate', { startDate: startDateWeek });
        salesByWeek.andWhere('machineTransaction.createdAt <= :endDate', { endDate: endDateWeek });
        const totalSaleByWeek = await salesByWeek.getRawMany();

        const salesByMonth = this.repoTransaction.createQueryBuilder('machineTransaction')
        salesByMonth.select(`${DashboardRepository.EFFECTIVE_PRICE_SQL} as price`)
        salesByMonth.where('machineTransaction.deletedAt IS NULL')
        salesByMonth.andWhere('machineTransaction.shopInfoId = :branchId', { branchId: branchId });
        salesByMonth.andWhere('machineTransaction.createdAt >= :startDate', { startDate: moment(startOfDay).startOf('month').toDate() });
        salesByMonth.andWhere('machineTransaction.createdAt <= :endDate', { endDate: moment(endOfDay).endOf('month').toDate() });
        const totalSaleByMonth = await salesByMonth.getRawMany();
        
        const convertPricesToNumbers = (data: {price: string}[]) => data.map(item => ({ ...item, price: parseFloat(item.price) }));
        
        const totalSaleByDayNumeric = convertPricesToNumbers(totalSaleByDay);
        const totalSaleByWeekNumeric = convertPricesToNumbers(totalSaleByWeek);
        const totalSaleByMonthNumeric = convertPricesToNumbers(totalSaleByMonth);
        
        return {
            totalSaleByDay: _.sumBy(totalSaleByDayNumeric,'price'),
            totalSaleByWeek: _.sumBy(totalSaleByWeekNumeric, 'price'),
            totalSaleByMonth: _.sumBy(totalSaleByMonthNumeric, 'price'),
        };
    }

    async findByBranchTotalMachine(branchId: number) {
        const machines = this.repoShopManagement.createQueryBuilder('shopManagement')
        machines.select([
            'shopManagement.id as id', 
            'shopManagement.shopManagementStatusOnline as status_online'
        ])
        machines.where('shopManagement.deletedAt IS NULL')
        machines.andWhere('shopManagement.shopInfoID = :branchId', { branchId: branchId });
        const result = await machines.getRawMany();
        return {
            totalActiveMachine: _.filter(result, { status_online: 'active' }).length,
            totalInactiveMachine: _.filter(result, { status_online: 'inactive' }).length,
            totalMachine: result.length,
        };
    }

    async findAllTotalMachine(permissions: number[]) {
        const machines = this.repoShopManagement.createQueryBuilder('shopManagement')
        machines.select([
            'shopManagement.id as id', 
            'shopManagement.shopManagementStatusOnline as status_online'
        ])
        machines.where('shopManagement.deletedAt IS NULL')
        if (permissions.length > 0) {
            machines.andWhere('shopManagement.shopInfoID IN (:...permissions)', { permissions: permissions });
        }
        const result = await machines.getRawMany();
        return {
            totalActiveMachine: _.filter(result, { status_online: 'active' }).length,
            totalInactiveMachine: _.filter(result, { status_online: 'inactive' }).length,
            totalMachine: result.length,
        };
    }

    async findAllGraphDataByDay(branchId: number) {
        const startDate = moment.tz('Asia/Bangkok').subtract(1, 'day').startOf('day').toDate();
        const endDate = moment.tz('Asia/Bangkok').endOf('day').toDate();
        const graphDataByDay = this.repoTransaction.createQueryBuilder('machineTransaction')
        graphDataByDay.select([`${DashboardRepository.EFFECTIVE_PRICE_SQL} as price`, 'machineTransaction.createdAt as "createdAt"'])
        graphDataByDay.where('machineTransaction.deletedAt IS NULL')
        graphDataByDay.andWhere('machineTransaction.shopInfoId = :branchId', { branchId: branchId });
        graphDataByDay.andWhere('machineTransaction.createdAt >= :startDate', { startDate: startDate });
        graphDataByDay.andWhere('machineTransaction.createdAt <= :endDate', { endDate: endDate });
        graphDataByDay.orderBy('machineTransaction.createdAt', 'DESC');
        return await graphDataByDay.getRawMany();
    
    }

    async findAllGraphDataByWeek(branchId: number) {
        const startDate = moment.tz('Asia/Bangkok').subtract(1, 'week').startOf('isoWeek').toDate();
        const endDate = moment.tz('Asia/Bangkok').endOf('isoWeek').toDate();
        const graphDataByWeek = this.repoTransaction.createQueryBuilder('machineTransaction')
        graphDataByWeek.select([`${DashboardRepository.EFFECTIVE_PRICE_SQL} as price`, 'machineTransaction.createdAt as "createdAt"'])
        graphDataByWeek.where('machineTransaction.deletedAt IS NULL')
        graphDataByWeek.andWhere('machineTransaction.shopInfoId = :branchId', { branchId: branchId });
        graphDataByWeek.andWhere('machineTransaction.createdAt >= :startDate', { startDate: startDate });
        graphDataByWeek.andWhere('machineTransaction.createdAt <= :endDate', { endDate: endDate });
        graphDataByWeek.orderBy('machineTransaction.createdAt', 'DESC');
        return await graphDataByWeek.getRawMany();
    }

    async findAllGraphDataByMonth(branchId: number) {
        const startDate = moment.tz('Asia/Bangkok').subtract(1, 'month').startOf('month').toDate();
        const endDate = moment.tz('Asia/Bangkok').endOf('month').toDate();
        const graphDataByMonth = this.repoTransaction.createQueryBuilder('machineTransaction')
        graphDataByMonth.select([`${DashboardRepository.EFFECTIVE_PRICE_SQL} as price`, 'machineTransaction.createdAt as "createdAt"'])
        graphDataByMonth.where('machineTransaction.deletedAt IS NULL')
        graphDataByMonth.andWhere('machineTransaction.shopInfoId = :branchId', { branchId: branchId });
        graphDataByMonth.andWhere('machineTransaction.createdAt >= :startDate', { startDate: startDate });
        graphDataByMonth.andWhere('machineTransaction.createdAt <= :endDate', { endDate: endDate });
        graphDataByMonth.orderBy('machineTransaction.createdAt', 'DESC');
        return await graphDataByMonth.getRawMany();
    }

    async findMachineStatusByBranch(branchId: number) {
        return this.repoShopManagement
            .createQueryBuilder('shopManagement')
            .leftJoinAndSelect('shopManagement.machineInfo', 'machineInfo')
            .where('shopManagement.deletedAt IS NULL')
            .andWhere('shopManagement.shopInfoID = :branchId', { branchId })
            .orderBy('shopManagement.id', 'ASC')
            .getMany();
    }

    async findLatestActiveTransactionsByShopManagementIds(shopManagementIds: number[]) {
        if (!shopManagementIds.length) {
            return [];
        }

        const latestSubQuery = this.repoTransaction
            .createQueryBuilder('sub')
            .select('sub.shop_management_id', 'shop_management_id')
            .addSelect('MAX(sub.created_at)', 'max_created_at')
            .where('sub.deleted_at IS NULL')
            .andWhere('sub.status = :status', { status: 'active' })
            .andWhere('sub.shop_management_id IN (:...shopManagementIds)', { shopManagementIds })
            .groupBy('sub.shop_management_id');

        return this.repoTransaction
            .createQueryBuilder('machineTransaction')
            .innerJoin(
                `(${latestSubQuery.getQuery()})`,
                'latest',
                'latest.shop_management_id = machineTransaction.shop_management_id AND latest.max_created_at = machineTransaction.created_at',
            )
            .setParameters(latestSubQuery.getParameters())
            .leftJoinAndSelect('machineTransaction.machineProgram', 'machineProgram')
            .where('machineTransaction.deletedAt IS NULL')
            .andWhere('machineTransaction.status = :status', { status: 'active' })
            .andWhere('machineTransaction.shopManagementId IN (:...shopManagementIds)', { shopManagementIds })
            .getMany();
    }

    /**
     * Latest non-deleted transaction per shop_management id (any status),
     * with relations needed for Branch Income display fields.
     * DISTINCT ON + createdAt/id DESC guarantees exactly one deterministic row
     * even when multiple rows share the same created_at.
     */
    async findLatestBranchIncomeTransactionsByShopManagementIds(shopManagementIds: number[]) {
        if (!shopManagementIds.length) {
            return [];
        }

        return this.repoTransaction
            .createQueryBuilder('machineTransaction')
            .distinctOn(['machineTransaction.shopManagementId'])
            .leftJoinAndSelect('machineTransaction.shopInfo', 'shopInfo')
            .leftJoinAndSelect('machineTransaction.machineInfo', 'machineInfo')
            .leftJoinAndSelect('machineTransaction.programInfo', 'programInfo')
            .leftJoinAndSelect('machineTransaction.shopManagement', 'shopManagement')
            .where('machineTransaction.deletedAt IS NULL')
            .andWhere('machineTransaction.shopManagementId IN (:...shopManagementIds)', { shopManagementIds })
            .orderBy('machineTransaction.shopManagementId', 'ASC')
            .addOrderBy('machineTransaction.createdAt', 'DESC')
            .addOrderBy('machineTransaction.id', 'DESC')
            .getMany();
    }

    async findLatestTransactionsByShopManagementNames(
        branchId: number,
        shopManagementNames: string[],
    ) {
        if (!shopManagementNames.length) {
            return [];
        }

        return this.repoTransaction
            .createQueryBuilder('machineTransaction')
            .leftJoinAndSelect('machineTransaction.machineProgram', 'machineProgram')
            .innerJoinAndSelect('machineTransaction.shopManagement', 'shopManagement')
            .where('machineTransaction.deletedAt IS NULL')
            .andWhere('shopManagement.shopInfoID = :branchId', { branchId })
            .andWhere('shopManagement.shopManagementName IN (:...shopManagementNames)', {
                shopManagementNames,
            })
            .orderBy('machineTransaction.createdAt', 'DESC')
            .getMany();
    }

    async findAllGraphDataByYear(branchId: number) {
        const startDate = moment.tz('Asia/Bangkok').subtract(1, 'year').startOf('year').toDate();
        const endDate = moment.tz('Asia/Bangkok').endOf('year').toDate();
        const graphDataByYear = this.repoTransaction.createQueryBuilder('machineTransaction')
        graphDataByYear.select([`${DashboardRepository.EFFECTIVE_PRICE_SQL} as price`, 'machineTransaction.createdAt as "createdAt"'])
        graphDataByYear.where('machineTransaction.deletedAt IS NULL')
        graphDataByYear.andWhere('machineTransaction.shopInfoId = :branchId', { branchId: branchId });
        graphDataByYear.andWhere('machineTransaction.createdAt >= :startDate', { startDate: startDate });
        graphDataByYear.andWhere('machineTransaction.createdAt <= :endDate', { endDate: endDate });
        graphDataByYear.orderBy('machineTransaction.createdAt', 'DESC');
        return await graphDataByYear.getRawMany();
    }

   

}
