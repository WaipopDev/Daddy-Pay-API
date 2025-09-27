import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class ResponseDashboardSaleDto {
    @ApiProperty({ description: 'Total sale by day' })
    @IsNumber()
    totalSaleByDay: number;

    @ApiProperty({ description: 'Total sale by week' })
    @IsNumber()
    totalSaleByWeek: number;

    @ApiProperty({ description: 'Total sale by month' })
    @IsNumber()
    totalSaleByMonth: number;
}

export class ResponseDashboardMachineDto {
    @ApiProperty({ description: 'Total active machine' })
    @IsNumber()
    totalActiveMachine: number;

    @ApiProperty({ description: 'Total inactive machine' })
    @IsNumber()
    totalInactiveMachine: number;

    @ApiProperty({ description: 'Total machine' })
    @IsNumber()
    totalMachine: number;
}