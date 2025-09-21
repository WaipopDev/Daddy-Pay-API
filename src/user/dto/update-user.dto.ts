import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty({ 
        description: 'Updated by of the user', 
        example: "1",
        required: false,
    })
    @IsString()
    @IsOptional()
    updatedBy: string;
}
