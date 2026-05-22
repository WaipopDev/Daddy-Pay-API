import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDateString, IsOptional } from 'class-validator';

export class UpdateUserSubscribeDto {
    @ApiProperty({
        description: 'สถานะการสมัครสมาชิก',
        example: true,
    })
    @IsBoolean()
    subscribe: boolean;

    @ApiPropertyOptional({
        description: 'วันที่เริ่มสมัครสมาชิก',
        example: '2025-01-01',
    })
    @IsOptional()
    @IsDateString()
    @Transform(({ value }) => (value === '' || value == null ? null : value))
    subscribeStartDate?: string | null;

    @ApiPropertyOptional({
        description: 'วันที่สิ้นสุดสมัครสมาชิก',
        example: '2025-12-31',
    })
    @IsOptional()
    @IsDateString()
    @Transform(({ value }) => (value === '' || value == null ? null : value))
    subscribeEndDate?: string | null;
}
