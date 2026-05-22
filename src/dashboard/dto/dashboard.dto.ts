import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { EncodeId } from "src/utility/id-encoder.decorators";

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

export class DashboardMachineStatusItemDto {
    @ApiProperty({ description: 'Shop management ID (encoded)' })
    @Expose()
    @EncodeId()
    id: number;

    @ApiProperty({ description: 'Machine name' })
    @Expose()
    shopManagementName: string;

    @ApiProperty({ description: 'Machine ID' })
    @Expose()
    shopManagementMachineID: string;

    @ApiProperty({ description: 'IoT ID' })
    @Expose()
    shopManagementIotID: string;

    @ApiProperty({ description: 'Shop management status' })
    @Expose()
    shopManagementStatus: string;

    @ApiProperty({ description: 'Online status' })
    @Expose()
    shopManagementStatusOnline: string;

    @ApiProperty({ description: 'Operational status (standby/active)' })
    @Expose()
    status: string;

    @ApiPropertyOptional({ description: 'Last connect time' })
    @Expose()
    lastConnect?: Date;

    @ApiPropertyOptional({ description: 'Error message' })
    @Expose()
    errorMessage?: string;

    @ApiProperty({ description: 'Machine type' })
    @Expose()
    machineType: string;

    @ApiProperty({ description: 'Machine brand' })
    @Expose()
    machineBrand: string;

    @ApiProperty({ description: 'Machine model' })
    @Expose()
    machineModel: string;

    @ApiPropertyOptional({ description: 'Machine picture path' })
    @Expose()
    machinePicturePath?: string;

    @ApiPropertyOptional({
        description: 'Latest active transaction created at (Asia/Bangkok, ISO +07:00)',
        example: '2025-05-21T17:30:00+07:00',
    })
    @Expose()
    lastTransactionCreatedAt?: string | null;

    @ApiPropertyOptional({ description: 'Program operation time in seconds (for countdown)' })
    @Expose()
    machineProgramOperationTime?: number | null;
}

export class DashboardMachineStatusSummaryDto {
    @ApiProperty({ description: 'Total machines' })
    @IsNumber()
    totalMachine: number;

    @ApiProperty({ description: 'Online active count' })
    @IsNumber()
    totalOnlineActive: number;

    @ApiProperty({ description: 'Online inactive count' })
    @IsNumber()
    totalOnlineInactive: number;

    @ApiProperty({ description: 'Operational active count' })
    @IsNumber()
    totalOperationalActive: number;

    @ApiProperty({ description: 'Operational standby count' })
    @IsNumber()
    totalOperationalStandby: number;
}

export class ResponseDashboardMachineStatusDto {
    @ApiProperty({ type: DashboardMachineStatusSummaryDto })
    @Expose()
    @Type(() => DashboardMachineStatusSummaryDto)
    summary: DashboardMachineStatusSummaryDto;

    @ApiProperty({ type: [DashboardMachineStatusItemDto] })
    @Expose()
    @Type(() => DashboardMachineStatusItemDto)
    items: DashboardMachineStatusItemDto[];
}