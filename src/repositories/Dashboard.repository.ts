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


}
