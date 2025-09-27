import { InjectEntityManager } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { MachineTransactionEntity } from 'src/models/entities/MachineTransaction.entity';
import { EntityManager } from 'typeorm';
import { ShopManagementEntity } from 'src/models/entities/ShopManagement.entity';
import moment from 'moment';
import _ from 'lodash';

@Injectable()
export class DashboardRepository {
    constructor(@InjectEntityManager() private readonly db: EntityManager) { }

    private get repoTransaction() {
        return this.db.getRepository(MachineTransactionEntity);
    }
    private get repoShopManagement() {
        return this.db.getRepository(ShopManagementEntity);
    }

    async findAllTotalSale(permissions: number[]) {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const salesByDay = this.repoTransaction.createQueryBuilder('machineTransaction')
        salesByDay.select('machineTransaction.price as price')
        salesByDay.where('machineTransaction.deletedAt IS NULL')
        salesByDay.andWhere('machineTransaction.createdAt >= :startDate', { startDate: startOfDay });
        salesByDay.andWhere('machineTransaction.createdAt <= :endDate', { endDate: endOfDay });
        if(permissions.length > 0){
            salesByDay.andWhere('machineTransaction.shopInfoId IN (:...permissions)', { permissions: permissions });
        }
        const totalSaleByDay = await salesByDay.getRawMany();
        const salesByWeek = this.repoTransaction.createQueryBuilder('machineTransaction')
        salesByWeek.select('machineTransaction.price as price')
        salesByWeek.where('machineTransaction.deletedAt IS NULL')
        salesByWeek.andWhere('machineTransaction.createdAt >= :startDate', { startDate: moment(startOfDay).startOf('week').toDate() });
        salesByWeek.andWhere('machineTransaction.createdAt <= :endDate', { endDate: moment(endOfDay).endOf('week').toDate() });
        if(permissions.length > 0){
            salesByWeek.andWhere('machineTransaction.shopInfoId IN (:...permissions)', { permissions: permissions });
        }
        const totalSaleByWeek = await salesByWeek.getRawMany();

        const salesByMonth = this.repoTransaction.createQueryBuilder('machineTransaction')
        salesByMonth.select('machineTransaction.price as price')
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
        const startDate = moment.utc().subtract(1, 'day').startOf('day').toDate();
        const endDate = moment.utc().endOf('day').toDate();
        const graphDataByDay = this.repoTransaction.createQueryBuilder('machineTransaction')
        graphDataByDay.select(['machineTransaction.price as price', 'machineTransaction.createdAt as "createdAt"'])
        graphDataByDay.where('machineTransaction.deletedAt IS NULL')
        graphDataByDay.andWhere('machineTransaction.shopInfoId = :branchId', { branchId: branchId });
        graphDataByDay.andWhere('machineTransaction.createdAt >= :startDate', { startDate: startDate });
        graphDataByDay.andWhere('machineTransaction.createdAt <= :endDate', { endDate: endDate });
        graphDataByDay.orderBy('machineTransaction.createdAt', 'DESC');
        return await graphDataByDay.getRawMany();
    
    }

    async findAllGraphDataByWeek(branchId: number) {
        const startDate = moment.utc().subtract(1, 'week').startOf('week').toDate();
        const endDate = moment.utc().endOf('week').toDate();
        const graphDataByWeek = this.repoTransaction.createQueryBuilder('machineTransaction')
        graphDataByWeek.select(['machineTransaction.price as price', 'machineTransaction.createdAt as "createdAt"'])
        graphDataByWeek.where('machineTransaction.deletedAt IS NULL')
        graphDataByWeek.andWhere('machineTransaction.shopInfoId = :branchId', { branchId: branchId });
        graphDataByWeek.andWhere('machineTransaction.createdAt >= :startDate', { startDate: startDate });
        graphDataByWeek.andWhere('machineTransaction.createdAt <= :endDate', { endDate: endDate });
        graphDataByWeek.orderBy('machineTransaction.createdAt', 'DESC');
        return await graphDataByWeek.getRawMany();
    }

    async findAllGraphDataByMonth(branchId: number) {
        const startDate = moment.utc().subtract(1, 'month').startOf('month').toDate();
        const endDate = moment.utc().endOf('month').toDate();
        const graphDataByMonth = this.repoTransaction.createQueryBuilder('machineTransaction')
        graphDataByMonth.select(['machineTransaction.price as price', 'machineTransaction.createdAt as "createdAt"'])
        graphDataByMonth.where('machineTransaction.deletedAt IS NULL')
        graphDataByMonth.andWhere('machineTransaction.shopInfoId = :branchId', { branchId: branchId });
        graphDataByMonth.andWhere('machineTransaction.createdAt >= :startDate', { startDate: startDate });
        graphDataByMonth.andWhere('machineTransaction.createdAt <= :endDate', { endDate: endDate });
        graphDataByMonth.orderBy('machineTransaction.createdAt', 'DESC');
        return await graphDataByMonth.getRawMany();
    }

    async findAllGraphDataByYear(branchId: number) {
        const startDate = moment.utc().subtract(1, 'year').startOf('year').toDate();
        const endDate = moment.utc().endOf('year').toDate();
        const graphDataByYear = this.repoTransaction.createQueryBuilder('machineTransaction')
        graphDataByYear.select(['machineTransaction.price as price', 'machineTransaction.createdAt as "createdAt"'])
        graphDataByYear.where('machineTransaction.deletedAt IS NULL')
        graphDataByYear.andWhere('machineTransaction.shopInfoId = :branchId', { branchId: branchId });
        graphDataByYear.andWhere('machineTransaction.createdAt >= :startDate', { startDate: startDate });
        graphDataByYear.andWhere('machineTransaction.createdAt <= :endDate', { endDate: endDate });
        graphDataByYear.orderBy('machineTransaction.createdAt', 'DESC');
        return await graphDataByYear.getRawMany();
    }

   

}
