import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateProgramInfoDto {
    @ApiPropertyOptional({ 
        description: 'Machine ID (encoded)',
        example: 'ABC123'
    })
    @IsOptional()
    @IsString()
    machineId?: string;

    @ApiPropertyOptional({ 
        description: 'Program name',
        example: 'Updated Wash Program'
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    programName?: string;

    @ApiPropertyOptional({ 
        description: 'Program description',
        example: 'Updated description for wash program'
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    programDescription?: string;
}
