import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional({ description: 'หน้าที่', type: 'number', default: 1 })
  @IsOptional()
  @IsNumberString()
  page: number = 1;

  @ApiPropertyOptional({ description: 'จำนวนข้อมูลที่แสดง', type: 'number', default: 10 })
  @IsOptional()
  @IsNumberString()
  limit: number = 10;
}

export class PaginationResponseDto {

  @ApiPropertyOptional({ description: 'หน้าปัจจุบัน' })
  currentPage: number;

  @ApiPropertyOptional({ description: 'จำนวนรายการทั้งหมด' })
  totalItems: number;

  @ApiPropertyOptional({ description: 'จำนวนรายการทั้งหมด' })
  itemCount: number;

  @ApiPropertyOptional({ description: 'จำนวนรายการต่อหน้า' })
  itemsPerPage: number;

  @ApiPropertyOptional({ description: 'จำนวนหน้าทั้งหมด' })
  totalPages: number;
}