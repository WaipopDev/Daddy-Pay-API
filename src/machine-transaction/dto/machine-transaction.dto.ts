import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
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
  } from 'class-validator';

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

    @ApiProperty({ description: 'idBranch' })
    @IsNumber()
    idBranch: number;

    @ApiProperty({ description: 'idMachine' })
    @IsString()
    idMachine: string;

    @ApiProperty({ description: 'transactionId' })
    @IsString()
    @IsOptional()
    transactionId?: string;

    @ApiProperty({ description: 'errorMsg' })
    @IsString()
    @IsOptional()
    errorMsg?: string;

}

export class BodyPayloadMachineDTO extends PayloadMachineDTO {}

export class ResponseMachineTransactionDTO {
    @ApiProperty({ description: 'status' })
    @IsString()
    status: string;

    @ApiProperty({ description: 'message' })
    @IsString()
    message: string;
}