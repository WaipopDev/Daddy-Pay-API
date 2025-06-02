import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsOptional, IsEnum, IsDateString, IsNumber } from 'class-validator';
import { EncodeId } from 'src/utility/id-encoder.decorators';

export class ResponseMachineInfoDto {
    @ApiProperty({ description: 'Machine ID (encoded)' })
    @Expose()
    @EncodeId()
    id: number;

    @ApiProperty({ description: 'Machine unique key' })
    @Expose()
    machineKey: string;

    @ApiProperty({ description: 'Machine type' })
    @Expose()
    machineType: string;

    @ApiProperty({ description: 'Machine brand' })
    @Expose()
    machineBrand: string;

    @ApiProperty({ description: 'Machine model' })
    @Expose()
    machineModel: string;

    @ApiPropertyOptional({ description: 'Machine description' })
    @Expose()
    machineDescription?: string;

    @ApiPropertyOptional({ description: 'Machine picture path' })
    @Expose()
    machinePicturePath?: string;

    @ApiProperty({ description: 'Created date' })
    @Expose()
    createdAt: Date;

    @ApiProperty({ description: 'Updated date' })
    @Expose()
    updatedAt: Date;

    @ApiProperty({ description: 'Created by user ID' })
    @Expose()
    createdBy: number;

    @ApiProperty({ description: 'Updated by user ID' })
    @Expose()
    updatedBy: number;
}

export class ResponseMachineInfoListDto {
    @ApiProperty({ description: 'Machine ID (encoded)' })
    @Expose()
    @EncodeId()
    id: number;

    @ApiProperty({ description: 'Machine unique key' })
    @Expose()
    machineKey: string;

    @ApiProperty({ description: 'Machine type' })
    @Expose()
    machineType: string;

    @ApiProperty({ description: 'Machine brand' })
    @Expose()
    machineBrand: string;

    @ApiProperty({ description: 'Machine model' })
    @Expose()
    machineModel: string;

    @ApiPropertyOptional({ description: 'Machine description' })
    @Expose()
    machineDescription?: string;

    @ApiProperty({ description: 'Created date' })
    @Expose()
    createdAt: Date;

    @ApiProperty({ description: 'Updated date' })
    @Expose()
    updatedAt: Date;
}

export class SortDto {
    @ApiPropertyOptional({ 
        description: 'Column to sort by',
        enum: ['id', 'machineKey', 'machineType', 'machineBrand', 'machineModel', 'createdAt', 'updatedAt']
    })
    @IsOptional()
    @IsString()
    column?: string;

    @ApiPropertyOptional({ 
        description: 'Sort order',
        enum: ['ASC', 'DESC']
    })
    @IsOptional()
    @IsEnum(['ASC', 'DESC'])
    sort?: 'ASC' | 'DESC';
}

export class PaginatedMachineInfoResponseDto {
    @ApiProperty({ type: [ResponseMachineInfoDto] })
    items: ResponseMachineInfoDto[];

    @ApiProperty({
        description: 'Pagination metadata',
        example: {
            totalItems: 100,
            itemCount: 10,
            itemsPerPage: 10,
            totalPages: 10,
            currentPage: 1
        }
    })
    meta: {
        totalItems: number;
        itemCount: number;
        itemsPerPage: number;
        totalPages: number;
        currentPage: number;
    };
}
