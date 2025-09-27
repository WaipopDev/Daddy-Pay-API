import { Injectable } from '@nestjs/common';
import { ReportBranchIncomeDto, ReportKbankPaymentDto } from './dto/report.dto';
import { ReportRepository } from 'src/repositories/Report.repository';
import { FindOptionsWhere, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { MachineTransactionEntity } from 'src/models/entities/MachineTransaction.entity';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { UsersRepository } from 'src/repositories/Users.repository';

@Injectable()
export class ReportService {
    constructor(
        private readonly reportRepository: ReportRepository,
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
    async findBranchIncome(query: ReportBranchIncomeDto, userId: number) {
        const permissions = await this.getPermissions(userId);
        const transactions = await this.reportRepository.findBranchIncome(query, permissions);
        return transactions;
    }

    async sumBranchIncome(query: ReportBranchIncomeDto, userId: number) {
        const permissions = await this.getPermissions(userId);
        const transactions = await this.reportRepository.sumBranchIncome(query, permissions);
        return transactions;
    }

    async kbankPayment(query: ReportKbankPaymentDto, userId: number) {
        const permissions = await this.getPermissions(userId);
        const transactions = await this.reportRepository.kbankPayment(query, permissions);
        return transactions;
    }
    async kbankPaymentSum(query: ReportKbankPaymentDto, userId: number) {
        const permissions = await this.getPermissions(userId);
        const transactions = await this.reportRepository.kbankPaymentSum(query, permissions);
       
        return transactions;
    }
}
