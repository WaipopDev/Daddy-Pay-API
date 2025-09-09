import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNumber, IsObject, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";
import { ResponseMachineInfoDto, ResponseProgramInfoDto, ResponseShopInfoDto } from "src/shop-management/dto/shop-management.dto";
import { IdEncoderService } from "src/utility/id-encoder.service";

export class ReportBranchIncomeDto {
    @ApiProperty({ description: 'Branch ID', required: false })
    @IsString()
    @IsOptional()
    @Transform(({ value }) => value ? IdEncoderService.decode(value) : value)
    branchId: string;

    @ApiProperty({ description: 'Payment type', required: false })
    @IsString()
    @IsOptional()
    paymentType: string;

    @ApiProperty({ description: 'Machine name', required: false })
    @IsString()
    @IsOptional()
    machineName: string;

    @ApiProperty({ description: 'Program name', required: false })
    @IsString()
    @IsOptional()
    programName: string;

    @ApiProperty({ description: 'Start date' , example: '2025-01-01', required: true })
    @IsString()
    startDate: string;

    @ApiProperty({ description: 'End date' , example: '2025-01-01', required: true })
    @IsString()
    endDate: string;

    @ApiProperty({ description: 'Page' , example: 1 , default: 1 , required: true })
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    page: number;

    @ApiProperty({ description: 'Limit' , example: 50 , default: 50 , required: true })
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    limit: number;
}

export class ResponseMachineTransactionDto {
    @ApiProperty({ description: 'Transaction ID' })
    @IsString()
    id: string;

    @ApiProperty({ description: 'Branch ID' })
    @IsString()
    shopInfoId: string;

    @ApiProperty({ description: 'Price type' })
    @IsString()
    priceType: string;
    
    @ApiProperty({ description: 'Price' })
    @IsNumber()
    price: number;

    @ApiProperty({ description: 'Transaction ID' })
    @IsString()
    transactionId: string;

    @ApiProperty({ description: 'Transaction IoT' })
    @IsString()
    transactionIot: string;

    @ApiProperty({ description: 'Created at' })
    @IsDate()
    createdAt: Date;

    @ApiProperty({ description: 'Shop info' })
    @IsObject()
    shopInfo: ResponseShopInfoDto;

    @ApiProperty({ description: 'Machine info' })
    @IsObject()
    machineInfo: ResponseMachineInfoDto;

    @ApiProperty({ description: 'Program info' })
    @IsObject()
    programInfo: ResponseProgramInfoDto;
    
}

export class ReportBranchIncomePaginationDto {
    @ApiProperty({ description: 'List of transactions' , type: [ResponseMachineTransactionDto] })
    items: ResponseMachineTransactionDto[];

    @ApiProperty({ description: 'Pagination metadata' })
    meta: {
        totalItems: number;
        itemCount: number;
        itemsPerPage: number;
        totalPages: number;
        currentPage: number;
    };
}