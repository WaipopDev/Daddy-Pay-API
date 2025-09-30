import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEmail,
  IsEnum,
  MaxLength,
  IsNotEmpty,
  IsNumber,
  IsObject,
} from 'class-validator';

enum ShopStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export class CreateShopInfoDto {
  @ApiProperty({ description: 'Shop unique key', maxLength: 255 })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  shopKey?: string;

  @ApiProperty({ description: 'Shop code', maxLength: 255 }) 
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  shopCode: string;

  @ApiProperty({ description: 'Shop name', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  shopName: string;

  @ApiPropertyOptional({ description: 'Shop address' })
  @IsOptional()
  @IsString()
  shopAddress?: string;

  @ApiPropertyOptional({ description: 'Shop contact information', maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  shopContactInfo?: string;

  @ApiPropertyOptional({ description: 'Shop mobile phone', maxLength: 20 })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  shopMobilePhone?: string;

  @ApiPropertyOptional({ description: 'Shop email', maxLength: 100 })
  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  shopEmail?: string;

  @ApiPropertyOptional({ description: 'Shop latitude coordinate', maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  shopLatitude?: string;

  @ApiPropertyOptional({ description: 'Shop longitude coordinate', maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  shopLongitude?: string;

  @ApiProperty({ description: 'Shop status', enum: ShopStatus, default: ShopStatus.ACTIVE })
  @IsEnum(ShopStatus)
  shopStatus: ShopStatus = ShopStatus.ACTIVE;

  @ApiProperty({ description: 'Shop system name', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  shopSystemName: string;

  @ApiPropertyOptional({ description: 'Shop upload file path', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  shopUploadFile?: string;

  @ApiPropertyOptional({ description: 'Shop tax name', maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  shopTaxName?: string;

  @ApiPropertyOptional({ description: 'Shop tax ID', maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  shopTaxId?: string;

  @ApiPropertyOptional({ description: 'Shop tax address' })
  @IsOptional()
  @IsString()
  shopTaxAddress?: string;

  @ApiProperty({ description: 'Shop bank account name', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  shopBankAccount: string;

  @ApiProperty({ description: 'Shop bank account number', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  shopBankAccountNumber: string;

  @ApiProperty({ description: 'Shop bank name', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  shopBankName: string;

  @ApiProperty({ description: 'Shop bank branch', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  shopBankBranch: string;
}


export class CreateShopBankDto {
  @ApiProperty({ description: 'Bank active name', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  bankActiveName: string;

  @ApiProperty({ description: 'Bank active ID', required: false })
  @IsNumber()
  @IsOptional()
  bankActiveId?: number | null;

  @ApiProperty({ description: 'Bank active param', required: false })
  @IsObject()
  @IsOptional()
  bankActiveParam?: object | null;
}