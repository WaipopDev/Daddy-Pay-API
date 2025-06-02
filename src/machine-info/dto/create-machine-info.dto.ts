import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';

export class CreateMachineInfoDto {
  @ApiProperty({ description: 'Machine unique key', maxLength: 255 })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  machineKey?: string;

  @ApiProperty({ description: 'Machine type', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  machineType: string;

  @ApiProperty({ description: 'Machine brand', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  machineBrand: string;

  @ApiProperty({ description: 'Machine model', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  machineModel: string;

  @ApiPropertyOptional({ description: 'Machine description', maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  machineDescription?: string;

  @ApiPropertyOptional({ description: 'Machine picture file path', maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  machinePicturePath?: string;
}
