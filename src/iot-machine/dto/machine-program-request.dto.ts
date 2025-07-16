import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class MachineProgramRequestDto {
    @ApiProperty({ 
        description: 'Iot ID of the machine',
        example: 'MOMU03-2025Bi-3M' 
    })
    @IsString()
    @IsNotEmpty()
    iotId: string;

    @ApiProperty({ 
        description: 'Machine Program ID',
        example: 11 
    })
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @ApiProperty({ 
        description: 'Machine Program Key',
        example: 'MP-CTQ7P4NI' 
    })
    @IsString()
    @IsNotEmpty()
    machineProgramKey: string;

    @ApiProperty({ 
        description: 'priceType (coin, point, prompt_pay, member_card, force)',
        example: 'coin',
        enum: ['coin', 'point', 'prompt_pay', 'member_card', 'force']
    })
    @IsString()
    @IsNotEmpty()
    priceType: string;
    
    @ApiProperty({ 
        description: 'Status (active, standby, error)',
        example: 'standby',
        enum: ['active', 'standby', 'error']
    })
    @IsString()
    @IsNotEmpty()
    status: string;

    @ApiProperty({ 
        description: 'transactionId (optional)',
        example: '1234567890abcdef' 
    })
    @IsString()
    @IsOptional()
    transactionId?: string;

    @ApiProperty({ 
        description: 'transactionIot (optional)',
        example: 'xyz12345' 
    })
    @IsString()
    @IsOptional()
    transactionIot?: string;

    @ApiProperty({ 
        description: 'errorMessage (optional)',
        example: 'No error' 
    })
    @IsString()
    @IsOptional()
    errorMessage?: string;

}
