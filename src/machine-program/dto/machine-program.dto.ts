import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose, Transform, Type } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsEmail,
    IsEnum,
    IsIP,
    IsNotEmpty,
    IsNumber,
    IsNumberString,
    IsOptional,
    IsString,
    MaxLength,
    IsDecimal,
    IsPositive,
  } from 'class-validator';
import { EncodeId } from "src/utility/id-encoder.decorators";

export class ProgramMachineDTO {
    @ApiProperty({ description: 'Program ID' })
    @IsString()
    id: string;

    @ApiProperty({ description: 'Program name' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'Program description' })
    @IsString()
    description: string;

    @ApiProperty({ description: 'Program status' })
    @IsString()
    status: string;

    @ApiProperty({ description: 'Program order' })
    @IsString()
    order: string;

    @ApiProperty({ description: 'Program price' })
    @IsString()
    price: string;

    @ApiProperty({ description: 'Program type' })
    @IsString()
    type: string;

    @ApiProperty({ description: 'Program time' })
    @IsNumber()
    time: number;
}

export class ListMachineDTO {
    @ApiProperty({ description: 'Branch name' })
    @IsString()
    branchName: string;

    @ApiProperty({ description: 'Branch ID' })
    @IsString()
    idBranch: string;

    @ApiProperty({ description: 'Machine ID' })
    @IsString()
    idMachine: string;

    @ApiProperty({ description: 'Machine name' })
    @IsString()
    machineName: string;

    @ApiProperty({ description: 'Interval time' })
    @IsNumber()
    intervalTime: number;

    @ApiProperty({ description: 'Status' })
    @IsString()
    status: string;

    @ApiProperty({ description: 'Error message' })
    @IsString()
    errorMsg: string;

    @ApiProperty({ description: 'Program', isArray: true, type: ProgramMachineDTO })
    program: ProgramMachineDTO[];

}

export class PayloadMachineDTO {
    @ApiProperty({ description: 'idProgram' })
    @IsString()
    idProgram: string;

    @ApiProperty({ description: 'status' })
    @IsString()
    status: string;

    @ApiProperty({ description: 'countdownTime' })
    @IsNumber()
    countdownTime: number;

    @ApiProperty({ description: 'priceType' })
    @IsString()
    priceType: string;

    @ApiProperty({ description: 'transactionId' })
    @IsString()
    @IsOptional()
    transactionId?: string;

    @ApiProperty({ description: 'errorMsg' })
    @IsString()
    @IsOptional()
    errorMsg?: string;

}

export class MachineDTO {
    @ApiProperty({ description: 'Branch name' })
    @IsString()
    branchName: string;

    @ApiProperty({ description: 'Branch ID' })
    @IsString()
    idBranch: string;

    @ApiProperty({ description: 'Machine ID' })
    @IsString()
    idMachine: string;

    @ApiProperty({ description: 'Machine name' })
    @IsString()
    machineName: string;

    @ApiProperty({ description: 'Interval time' })
    @IsNumber()
    intervalTime: number;

    @ApiProperty({ description: 'Status' })
    @IsString()
    status: string;

    @ApiProperty({ description: 'Error message' })
    @IsString()
    errorMsg: string;

    @ApiProperty({ description: 'Time', })
    @IsNumber()
    time: number;
}

export class ResponseMachineInfoDto {
    @ApiProperty({ description: 'Machine ID (encoded)' })
    @Expose()
    @Transform(({ value }) => value) // Will be encoded by the service
    id: string;

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
    @Transform(({ value }) => value) // Will be encoded by the service
    id: string;

    @ApiProperty({ description: 'Program unique key' })
    @Expose()
    programKey: string;

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

    @ApiProperty({ description: 'Machine information', type: ResponseMachineInfoDto })
    @Expose()
    @Type(() => ResponseMachineInfoDto)
    machineInfo: ResponseMachineInfoDto;
}

export class MachineProgramResponseDto {
    @ApiProperty({ description: 'Program ID (encoded)' })
    @Expose()
    @Transform(({ value }) => value) // Will be encoded by the service
    id: string;

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


export class ResponseShopInfoDto {
    @ApiProperty({ description: 'Shop ID (encoded)' })
    @Expose()
    id: string;

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

export class ResponseMachineProgramDto {
    @ApiProperty({ description: 'Machine Program ID (encoded)' })
    @Expose()
    @EncodeId()
    id: string;

    @ApiProperty({ description: 'Machine program unique key' })
    @Expose()
    machineProgramKey: string;

    @ApiProperty({ description: 'Machine program price' })
    @Expose()
    machineProgramPrice: number;

    @ApiProperty({ description: 'Machine program operation time in minutes' })
    @Expose()
    machineProgramOperationTime: number;

    @ApiProperty({ description: 'Machine program status' })
    @Expose()
    machineProgramStatus: string;
}

export class ResponseProgramInfoByAllDto {
    @ApiProperty({ description: 'Program ID (encoded)' })
    @Expose()
    @EncodeId()
    id: string;

    @ApiProperty({ description: 'Program name' })
    @Expose()
    programName: string;

    @ApiProperty({ description: 'Program description' })
    @Expose()
    programDescription: string;
}
export class ResponseMachineProgramAllDto {
    @ApiProperty({ description: 'Machine Program ID (encoded)' })
    @Expose()
    @EncodeId()
    id: string;

    @ApiProperty({ description: 'Machine program unique key' })
    @Expose()
    machineProgramKey: string;

    @ApiProperty({ description: 'Machine program price' })
    @Expose()
    machineProgramPrice: number;

    @ApiProperty({ description: 'Machine program operation time in minutes' })
    @Expose()
    machineProgramOperationTime: number;

    @ApiProperty({ description: 'Machine program status' })
    @Expose()
    machineProgramStatus: string;

    @ApiProperty({ description: 'Program information', type: ResponseProgramInfoByAllDto })
    @Expose()
    @Type(() => ResponseProgramInfoByAllDto)
    programInfo: ResponseProgramInfoByAllDto;

}