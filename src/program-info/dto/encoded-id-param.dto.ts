import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class EncodedIdParamDto {
    @ApiProperty({ 
        description: 'Encoded ID parameter',
        example: 'ABC123'
    })
    @IsString()
    @IsNotEmpty()
    id: string;
}
