import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, MaxLength, IsInt, Min } from 'class-validator';

export class CreateShopManagementDto {
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
        description: 'Shop management name',
        example: 'Shop Management 1'
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    shopManagementName: string;

    @ApiPropertyOptional({ 
        description: 'Shop management description',
        example: 'Management for laundry shop'
    })
    @IsOptional()
    @IsString()
    shopManagementDescription?: string;

    @ApiProperty({ 
        description: 'Shop management machine ID',
        example: 'MACHINE001'
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    shopManagementMachineID: string;

    @ApiProperty({ 
        description: 'Shop management IoT ID',
        example: 'IOT001'
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    shopManagementIotID: string;

    @ApiPropertyOptional({ 
        description: 'Shop management status',
        example: 'active',
        default: 'active'
    })
    @IsOptional()
    @IsString()
    @MaxLength(20)
    shopManagementStatus?: string;

    @ApiPropertyOptional({ 
        description: 'Shop management online status',
        example: 'active',
        default: 'active'
    })
    @IsOptional()
    @IsString()
    @MaxLength(20)
    shopManagementStatusOnline?: string;

    @ApiProperty({ 
        description: 'Shop management interval time (in minutes)',
        example: 30
    })
    @IsInt()
    @Min(1)
    shopManagementIntervalTime: number;
}
