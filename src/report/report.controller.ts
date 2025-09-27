import { Controller, Get, UseGuards, UseInterceptors, ClassSerializerInterceptor, Query, BadRequestException } from '@nestjs/common';
import { ReportService } from './report.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from 'src/guards/AuthAdmin.guard';
import { ReportBranchIncomeDto, ReportKbankPaymentDto } from './dto/report.dto';
import { User } from 'src/decorators/user.decorator';

@ApiTags('Report')
@ApiBearerAuth()
@UseGuards(AdminAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('report')
export class ReportController {
    constructor(private readonly reportService: ReportService) { }

    @Get('branch-income')
    findBranchIncome(
        @Query() query: ReportBranchIncomeDto,
        @User() userId: number
    ) {
        try {
            return this.reportService.findBranchIncome(query, userId);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Get('branch-income-sum')
    sumBranchIncome(
        @Query() query: ReportBranchIncomeDto,
        @User() userId: number
    ) {
        return this.reportService.sumBranchIncome(query, userId);
    }

    @Get('kbank-payment')
    kbankPayment(
        @Query() query: ReportKbankPaymentDto,
        @User() userId: number
    ) {
        try {
            return this.reportService.kbankPayment(query, userId);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Get('kbank-payment-sum')
    kbankPaymentSum(
        @Query() query: ReportKbankPaymentDto,
        @User() userId: number
    ) {
        try {
            return this.reportService.kbankPaymentSum(query, userId);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

}
