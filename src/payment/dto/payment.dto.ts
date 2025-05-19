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


export class ResponsePaymentDTO {

    @ApiProperty({ description: 'Status' })
    @IsString()
    status: string;

    @ApiProperty({ description: 'qrRawData' })
    @IsString()
    qrRawData: string;

    @ApiProperty({ description: 'transactionIdCall', })
    @IsString()
    transactionIdCall: 'string';
}