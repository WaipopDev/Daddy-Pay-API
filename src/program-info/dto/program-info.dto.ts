import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsString, IsOptional, IsEnum, IsDateString, IsNumber } from 'class-validator';
import { ESort } from 'src/constants/query.type';
import { EncodeId } from 'src/utility/id-encoder.decorators';

export enum ESortColumn {
  PROGRAM_NAME = 'programName',
}

export class SortDto {
  @ApiPropertyOptional({ description: 'เรียงลำดับข้อมูล', enum: ESortColumn })
  @IsOptional()
  @IsEnum(ESortColumn)
  column?: ESortColumn = ESortColumn.PROGRAM_NAME;

  @ApiPropertyOptional({ description: 'เรียงลำดับข้อมูล', enum: ESort })
  @IsEnum(ESort)
  @IsOptional()
  sort?: ESort = ESort.DESC;
}

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
}

export class ResponseProgramInfoDto {
    @ApiProperty({ description: 'Program ID (encoded)' })
    @Expose()
    @EncodeId()
    id: number;

    @ApiProperty({ description: 'Program unique key' })
    @Expose()
    programKey: string;

    @ApiProperty({ description: 'Machine info ID (encoded)' })
    @Expose()
    @EncodeId()
    machineInfoId: number;

    @ApiProperty({ description: 'Program name' })
    @Expose()
    programName: string;

    @ApiPropertyOptional({ description: 'Program description' })
    @Expose()
    programDescription?: string;

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

    @ApiProperty({ description: 'Machine information', type: ResponseMachineInfoDto })
    @Expose()
    @Type(() => ResponseMachineInfoDto)
    machineInfo: ResponseMachineInfoDto;
}

export class ResponseProgramInfoListDto extends ResponseProgramInfoDto {}


export class QueryProgramInfoDto extends SortDto {
    @ApiPropertyOptional({ description: 'Page number', example: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    page?: number;

    @ApiPropertyOptional({ description: 'Items per page', example: 10 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    limit?: number;

    @ApiPropertyOptional({ description: 'Machine ID to filter by (encoded)' })
    @IsOptional()
    @IsString()
    machineId?: string;
}

export class ProgramInfoPaginationDto {
    @ApiProperty({ description: 'List of program info', type: [ResponseProgramInfoListDto] })
    items: ResponseProgramInfoListDto[];

    @ApiProperty({ description: 'Pagination metadata' })
    meta: {
        totalItems: number;
        itemCount: number;
        itemsPerPage: number;
        totalPages: number;
        currentPage: number;
    };
}
