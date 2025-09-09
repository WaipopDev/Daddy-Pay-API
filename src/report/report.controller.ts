import { Controller, Get, UseGuards, UseInterceptors, ClassSerializerInterceptor, Query, BadRequestException } from '@nestjs/common';
import { ReportService } from './report.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from 'src/guards/AuthAdmin.guard';
import { ReportBranchIncomeDto } from './dto/report.dto';

@ApiTags('Report')
@ApiBearerAuth()
@UseGuards(AdminAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('report')
export class ReportController {
    constructor(private readonly reportService: ReportService) { }

    @Get('branch-income')
    findBranchIncome(@Query() query: ReportBranchIncomeDto) {
        try {
            return this.reportService.findBranchIncome(query);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Get('branch-income-sum')
    sumBranchIncome(@Query() query: ReportBranchIncomeDto) {
        return this.reportService.sumBranchIncome(query);
    }

}
