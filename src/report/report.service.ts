import { Injectable } from '@nestjs/common';
import { ReportBranchIncomeDto, ReportKbankPaymentDto } from './dto/report.dto';
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

    async kbankPayment(query: ReportKbankPaymentDto) {
        const transactions = await this.reportRepository.kbankPayment(query);
        return transactions;
    }
    async kbankPaymentSum(query: ReportKbankPaymentDto) {
        const transactions = await this.reportRepository.kbankPaymentSum(query);
       
        return transactions;
    }
}
