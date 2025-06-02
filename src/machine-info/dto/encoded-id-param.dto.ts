import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class EncodedIdParamDto {
    @ApiProperty({ description: 'Encoded Machine ID' })
    @IsString()
    @IsNotEmpty()
    id: string;
}
