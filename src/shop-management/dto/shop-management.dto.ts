import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsString, IsOptional, IsEnum, IsDateString, IsNumber } from 'class-validator';
import { ESort } from 'src/constants/query.type';
import { EncodeId } from 'src/utility/id-encoder.decorators';

export enum ESortColumn {
  SHOP_MANAGEMENT_NAME = 'shopManagementName',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export class SortDto {
  @ApiPropertyOptional({ description: 'เรียงลำดับข้อมูล', enum: ESortColumn })
  @IsOptional()
  @IsEnum(ESortColumn)
  column?: ESortColumn = ESortColumn.SHOP_MANAGEMENT_NAME;

  @ApiPropertyOptional({ description: 'เรียงลำดับข้อมูล', enum: ESort })
  @IsEnum(ESort)
  @IsOptional()
  sort?: ESort = ESort.DESC;
}

export class ResponseShopInfoDto {
    @ApiProperty({ description: 'Shop ID (encoded)' })
    @Expose()
    @EncodeId()
    id: number;

    @ApiProperty({ description: 'Shop unique key' })
    @Expose()
    shopKey: string;

    @ApiProperty({ description: 'Shop name' })
    @Expose()
    shopName: string;

    @ApiProperty({ description: 'Shop code' })
    @Expose()
    shopCode: string;
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

    @ApiProperty({ description: 'Program name' })
    @Expose()
    programName: string;

    @ApiPropertyOptional({ description: 'Program description' })
    @Expose()
    programDescription?: string;
}

export class ResponseShopManagementDto {
    @ApiProperty({ description: 'Shop Management ID (encoded)' })
    @Expose()
    @EncodeId()
    id: number;

    @ApiProperty({ description: 'Shop management unique key' })
    @Expose()
    shopManagementKey: string;

    @ApiProperty({ description: 'Shop management name' })
    @Expose()
    shopManagementName: string;

    @ApiPropertyOptional({ description: 'Shop management description' })
    @Expose()
    shopManagementDescription?: string;

    @ApiProperty({ description: 'Shop management machine ID' })
    @Expose()
    shopManagementMachineID: string;

    @ApiProperty({ description: 'Shop management IoT ID' })
    @Expose()
    shopManagementIotID: string;

    @ApiProperty({ description: 'Shop management status' })
    @Expose()
    shopManagementStatus: string;

    @ApiProperty({ description: 'Shop management online status' })
    @Expose()
    shopManagementStatusOnline: string;

    @ApiProperty({ description: 'Shop management interval time' })
    @Expose()
    shopManagementIntervalTime: number;

    @ApiProperty({ description: 'Shop info ID (encoded)' })
    @Expose()
    @EncodeId()
    shopInfoID: number;

    @ApiProperty({ description: 'Machine info ID (encoded)' })
    @Expose()
    @EncodeId()
    machineInfoID: number;

    @ApiProperty({ description: 'Program info ID (encoded)' })
    @Expose()
    @EncodeId()
    programInfoID: number;

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

    @ApiProperty({ description: 'Shop information', type: ResponseShopInfoDto })
    @Expose()
    @Type(() => ResponseShopInfoDto)
    shopInfo: ResponseShopInfoDto;

    @ApiProperty({ description: 'Machine information', type: ResponseMachineInfoDto })
    @Expose()
    @Type(() => ResponseMachineInfoDto)
    machineInfo: ResponseMachineInfoDto;

    @ApiProperty({ description: 'Program information', type: ResponseProgramInfoDto })
    @Expose()
    @Type(() => ResponseProgramInfoDto)
    programInfo: ResponseProgramInfoDto;
}

export class ResponseShopManagementListDto {
    @ApiProperty({ description: 'Shop Management ID (encoded)' })
    @Expose()
    @EncodeId()
    id: number;

    @ApiProperty({ description: 'Shop management name' })
    @Expose()
    shopManagementName: string;
}

export class QueryShopManagementDto extends SortDto {
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

    @ApiPropertyOptional({ description: 'Shop ID to filter by (encoded)' })
    @IsOptional()
    @IsString()
    shopId?: string;

    @ApiPropertyOptional({ description: 'Machine ID to filter by (encoded)' })
    @IsOptional()
    @IsString()
    machineId?: string;

    @ApiPropertyOptional({ description: 'Program ID to filter by (encoded)' })
    @IsOptional()
    @IsString()
    programId?: string;
}

export class ShopManagementPaginationDto {
    @ApiProperty({ description: 'List of shop management', type: [ResponseShopManagementDto] })
    items: ResponseShopManagementDto[];

    @ApiProperty({ description: 'Pagination metadata' })
    meta: {
        totalItems: number;
        itemCount: number;
        itemsPerPage: number;
        totalPages: number;
        currentPage: number;
    };
}
