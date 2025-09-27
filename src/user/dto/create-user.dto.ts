import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsArray, IsOptional, IsNotEmpty, MinLength, ArrayMinSize, IsDate } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ 
    description: 'Username for the user', 
    example: 'john_doe',
    minLength: 3
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @ApiProperty({ 
    description: 'Email address of the user', 
    example: 'john.doe@example.com'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ 
    description: 'Password for the user account', 
    example: 'securePassword123',
    minLength: 6,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(6)
  password: string;

  @ApiProperty({ 
    description: 'Role of the user', 
    example: 'admin'
  })
  @IsString()
  @IsNotEmpty()
  role: string;

  @ApiProperty({ 
    description: 'ID of the user who created this user', 
    example: "1"
  })
  @IsString()
  @IsNotEmpty()
  createdBy: string;

  @ApiProperty({ 
    description: 'Array of shop IDs associated with the user', 
    example: ['ZGQ0NjYwOGFiYTJmYmJiY2E3OWIzYTFmZDY0OGQ4ZGY6MTQxMzJmZDQzZjBkMDJiMzYyM2RhNDYwZjMxMWRiMGM'],
    type: [String],
    isArray: true
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  shopIds: string[];

  @ApiProperty({ 
    description: 'Subscribe start date of the user', 
    example: '2025-01-01',
    nullable: true,
    required: false
  })
  @IsDate()
  @IsOptional()
  subscribeStartDate: Date | null;

  @ApiProperty({ 
    description: 'Subscribe end date of the user', 
    example: '2025-01-01',
    nullable: true,
    required: false
  })
  @IsDate()
  @IsOptional()
  subscribeEndDate: Date | null;
}
