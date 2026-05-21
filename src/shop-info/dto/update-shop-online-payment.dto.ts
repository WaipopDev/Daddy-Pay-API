import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsEnum, IsOptional } from 'class-validator';

export enum OnlinePaymentStatus {
    ENABLE = 'enable',
    DISABLE = 'disable',
}

export class UpdateShopOnlinePaymentDto {
    @ApiProperty({
        description: 'สถานะการชำระเงินออนไลน์',
        enum: OnlinePaymentStatus,
        example: OnlinePaymentStatus.ENABLE,
    })
    @IsEnum(OnlinePaymentStatus)
    onlinePaymentStatus: OnlinePaymentStatus;

    @ApiPropertyOptional({
        description: 'วันที่เปิดใช้งานชำระเงินออนไลน์',
        example: '2025-01-15',
    })
    @IsOptional()
    @IsDateString()
    @Transform(({ value }) => (value === '' || value == null ? null : value))
    onlineActivationDate?: string | null;

    @ApiPropertyOptional({
        description: 'วันที่ปิดการชำระเงินออนไลน์',
        example: '2025-12-31',
    })
    @IsOptional()
    @IsDateString()
    @Transform(({ value }) => (value === '' || value == null ? null : value))
    onlineCloseDate?: string | null;
}
