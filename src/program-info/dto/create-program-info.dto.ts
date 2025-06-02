import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateProgramInfoDto {
    @ApiProperty({ 
        description: 'Machine ID (encoded)',
        example: 'ABC123'
    })
    @IsString()
    @IsNotEmpty()
    machineId: string;

    @ApiProperty({ 
        description: 'Program name',
        example: 'Wash Program 1'
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    programName: string;

    @ApiPropertyOptional({ 
        description: 'Program description',
        example: 'Quick wash program for light fabrics'
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    programDescription?: string;
}
