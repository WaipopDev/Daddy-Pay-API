import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { DecodeId } from 'src/utility/id-encoder.decorators';
import { IsValidEncodedId } from 'src/utility/id-encoder.validators';

export class EncodedIdParamDto {
    @ApiProperty({ 
        description: 'รหัสที่เข้ารหัสแล้ว', 
        type: 'string',
        example: 'eyJhbGciOiJIUzI1NiJ9'
    })
    @IsString()
    @IsNotEmpty()
    @IsValidEncodedId()
    @DecodeId()
    id: string;
}
