import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength } from "class-validator";

export class CreateMachineProgramDto {
    @ApiProperty({ 
        description: 'Shop ID (encoded)',
        example: 'ABC123'
    })
    @IsString()
    @IsNotEmpty()
    shopId: string;

    @ApiProperty({ 
        description: 'Machine ID (encoded)',
        example: 'XYZ789'
    })
    @IsString()
    @IsNotEmpty()
    machineId: string;

    @ApiProperty({ 
        description: 'Program ID (encoded)',
        example: 'PGM456'
    })
    @IsString()
    @IsNotEmpty()
    programId: string;

    @ApiProperty({ 
        description: 'Machine program price',
        example: 25.50
    })
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    machineProgramPrice: number;

    @ApiProperty({ 
        description: 'Machine program operation time in minutes',
        example: 30
    })
    @IsNumber()
    @IsPositive()
    machineProgramOperationTime: number;

    @ApiProperty({ 
        description: 'Machine program status',
        example: 'ACTIVE'
    })
    @IsString()
    @IsOptional()
    @MaxLength(255)
    machineProgramStatus?: string;
}