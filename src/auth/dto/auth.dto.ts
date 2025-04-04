import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
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

export class AuthDTO {
    @ApiProperty({ description: 'key auth' })
    @IsString()
    keyAuth: string;

}