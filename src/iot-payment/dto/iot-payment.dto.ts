import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';

export class IotPaymentResponseDto {
    @ApiProperty({ 
        description: 'Transaction ID',
        example: '1234567890abcdef',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    transactionId: string;
}

export class IotPaymentResponseQRPaymentDto {
    @ApiProperty({ 
        description: 'QR Payment Raw Data',
        example: 'xxx',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    qrRawData: string;

    @ApiProperty({ 
        description: 'QR Payment Ref1',
        example: 'xxx',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    ref1: string;

    @ApiProperty({ 
        description: 'QR Payment Ref2',
        example: 'xxx',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    ref2: string;

}


export class IotPaymentQRPaymentRequestDto {
    @ApiProperty({ 
        description: 'Iot ID',
        example: 'MOMU03-2025Bi-3M',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    iotId: string;

    @ApiProperty({ 
        description: 'Machine Program Key',
        example: 'MP-CTQ7P4NI',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    machineProgramKey: string;

    @ApiProperty({ 
        description: 'shopManagement',
        example: 11,
        required: true
    })
    @Transform(({ value }) => parseInt(value, 10))
    @IsNumber()
    @IsNotEmpty()
    id: number;
}