import { Injectable } from '@nestjs/common';
import { DashboardRepository } from 'src/repositories/Dashboard.repository';
import { UsersRepository } from 'src/repositories/Users.repository';

@Injectable()
export class DashboardService {
    constructor(
        private readonly dashboardRepo: DashboardRepository,
        private readonly usersRepository: UsersRepository
    ) { }
    private async getPermissions(userId: number) {
        let permissions: number[] = [];
        if(userId){
            const result = await this.usersRepository.findRolePermissions(userId);
            permissions = result.map(item => item.shopId);
        }
        return permissions;
    }
    async getTotalSale(userId: number) {
        const permissions = await this.getPermissions(userId);
        const transactions = await this.dashboardRepo.findAllTotalSale(permissions);
        return transactions;
        // return this.reportRepo.getTotalSale(userId);
    }

    async getTotalMachine(userId: number) {
        const permissions = await this.getPermissions(userId);
        const machines = await this.dashboardRepo.findAllTotalMachine(permissions);
        return machines;
    }
}
