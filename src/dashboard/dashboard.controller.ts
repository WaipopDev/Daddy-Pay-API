import { ClassSerializerInterceptor, Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AdminAuthGuard } from 'src/guards/AuthAdmin.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/decorators/user.decorator';
import { ResponseDashboardSaleDto, ResponseDashboardMachineDto } from './dto/dashboard.dto';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(AdminAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @Get('total-sales')
    async getTotalSale(
        @User() userId: number
    ): Promise<ResponseDashboardSaleDto> {
        return await this.dashboardService.getTotalSale(userId);
    }

    @Get('total-machine')
    async getTotalMachine(
        @User() userId: number
    ): Promise<ResponseDashboardMachineDto> {
        return await this.dashboardService.getTotalMachine(userId);
    }
}
