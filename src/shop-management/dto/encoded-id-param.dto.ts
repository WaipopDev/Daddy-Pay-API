import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class EncodedIdParamDto {
  @ApiProperty({ 
    description: 'Encoded ID',
    example: 'ABC123XYZ'
  })
  @IsString()
  @IsNotEmpty()
  id: string;
}
