import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export enum SubSubscriptionStatus {
    ACTIVE = 'active',
    EXPIRED = 'expired',
}

export class UpdateShopSubscriptionDto {
    @ApiProperty({
        description: 'สถานะการสมัครสมาชิก',
        enum: SubSubscriptionStatus,
        example: SubSubscriptionStatus.ACTIVE,
    })
    @IsEnum(SubSubscriptionStatus)
    subSubscriptionStatus: SubSubscriptionStatus;

    @ApiPropertyOptional({
        description: 'วันที่ลงทะเบียน',
        example: '2025-01-01',
    })
    @IsOptional()
    @IsDateString()
    @Transform(({ value }) => (value === '' || value == null ? null : value))
    subRegistrationDate?: string | null;

    @ApiPropertyOptional({
        description: 'วันที่หมดอายุ',
        example: '2025-12-31',
    })
    @IsOptional()
    @IsDateString()
    @Transform(({ value }) => (value === '' || value == null ? null : value))
    subExpirationDate?: string | null;

    @ApiPropertyOptional({
        description: 'รอบการแจ้งเตือน (วัน)',
        example: 30,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Transform(({ value }) => (value === '' || value == null ? null : value))
    subNotificationCycle?: number | null;

    @ApiPropertyOptional({
        description: 'อีเมลสำหรับแจ้งเตือน',
        example: 'notify@example.com',
    })
    @IsOptional()
    @IsString()
    @Transform(({ value }) => (value === '' || value == null ? null : value))
    subNotifyToEmail?: string | null;
}
