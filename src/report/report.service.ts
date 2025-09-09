import { Injectable } from '@nestjs/common';
import { ReportBranchIncomeDto } from './dto/report.dto';
import { ReportRepository } from 'src/repositories/Report.repository';
import { FindOptionsWhere, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { MachineTransactionEntity } from 'src/models/entities/MachineTransaction.entity';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

@Injectable()
export class ReportService {
    constructor(private readonly reportRepository: ReportRepository) { }
    async findBranchIncome(query: ReportBranchIncomeDto) {

        const transactions = await this.reportRepository.findBranchIncome(query);
        return transactions;
    }

    async sumBranchIncome(query: ReportBranchIncomeDto) {
        const transactions = await this.reportRepository.sumBranchIncome(query);
        return transactions;
    }
}
