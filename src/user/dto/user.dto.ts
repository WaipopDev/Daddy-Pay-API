import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsEmail, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { ESort } from "src/constants/query.type";

export enum ESortColumn {
    ID = 'id',
    USERNAME = 'username',
    EMAIL = 'email',
    ROLE = 'role',
    ACTIVE = 'active',
    SUBSCRIBE = 'subscribe',
    IS_VERIFIED = 'isVerified',
    IS_ADMIN_LEVEL = 'isAdminLevel',
    CREATED_AT = 'createdAt',
    UPDATED_AT = 'updatedAt',
  }
  
  export class SortDto {
    @ApiPropertyOptional({ description: 'เรียงลำดับข้อมูล', enum: ESortColumn })
    @IsOptional()
    @IsEnum(ESortColumn)
    column: ESortColumn = ESortColumn.USERNAME;
  
    @ApiPropertyOptional({ description: 'เรียงลำดับข้อมูล', enum: ESort })
    @IsEnum(ESort)
    @IsOptional()
    sort: ESort = ESort.DESC;
  }

  export class QueryUserDto extends SortDto {
    @ApiPropertyOptional({ description: 'หน้าที่', example: 1, default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    page?: number = 1;

    @ApiPropertyOptional({ description: 'จำนวนต่อหน้า', example: 10, default: 10 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    limit?: number = 10;

    @ApiPropertyOptional({ description: 'ค้นหาชื่อผู้ใช้' })
    @IsOptional()
    @IsString()
    @Transform(({ value }) => (value === '' || value == null ? undefined : value))
    username?: string;

    @ApiPropertyOptional({ description: 'ค้นหาอีเมล' })
    @IsOptional()
    @IsString()
    @Transform(({ value }) => (value === '' || value == null ? undefined : value))
    email?: string;

    @ApiPropertyOptional({ description: 'Subscription (subscribe)', example: true })
    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => {
      if (value === '' || value == null) return undefined;
      if (value === 'true' || value === true) return true;
      if (value === 'false' || value === false) return false;
      return undefined;
    })
    subscribe?: boolean;

    @ApiPropertyOptional({ description: 'Verified', example: true })
    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => {
      if (value === '' || value == null) return undefined;
      if (value === 'true' || value === true) return true;
      if (value === 'false' || value === false) return false;
      return undefined;
    })
    isVerified?: boolean;
  }

  export class UsersPermissionsDto {
    @ApiProperty({ description: 'ID of the permission' })
    @IsNumber()
    id: number;
    
    @ApiProperty({ description: 'ID of the shop' })
    @IsNumber()
    shopId: number;

    @ApiProperty({ description: 'Status of the permission' })
    @IsString()
    status: string;

    @ApiProperty({ description: 'Created by of the permission' })
    @IsNumber()
    createdBy: number;

    @ApiProperty({ description: 'Updated by of the permission' })
    @IsNumber()
    updatedBy: number;

    @ApiProperty({ description: 'Created at of the permission' })
    @IsDate()
    createdAt: Date;

    @ApiProperty({ description: 'Updated at of the permission' })
    @IsDate()
    updatedAt: Date;
  }

  export class ResponseUserDto {
    @ApiProperty({ description: 'ID of the user' })
    @IsNumber()
    id: number;

    @ApiProperty({ description: 'Username of the user' })
    @IsString()
    username: string;

    @ApiProperty({ description: 'Email of the user' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'Role of the user' })
    @IsString()
    role: string;

    @ApiProperty({ description: 'Active of the user' })
    @IsBoolean()
    active: boolean;

    @ApiProperty({ description: 'Subscribe of the user' })
    @IsBoolean()
    subscribe: boolean;

    @ApiProperty({ description: 'Is verified of the user' })
    @IsBoolean()
    isVerified: boolean;

    @ApiProperty({ description: 'Is admin level of the user' })
    @IsNumber()
    isAdminLevel: number;

    @ApiProperty({ description: 'Subscribe start date of the user' })
    @IsDate()
    @IsOptional()
    subscribeStartDate: Date | null;

    @ApiProperty({ description: 'Subscribe end date of the user' })
    @IsDate()
    @IsOptional()
    subscribeEndDate: Date | null;

    @ApiProperty({ description: 'Created by of the user' })
    @IsNumber()
    createdBy: number;

    @ApiProperty({ description: 'Updated by of the user' })
    @IsNumber()
    updatedBy: number;

    @ApiProperty({ description: 'Created at of the user' })
    @IsDate()
    createdAt: Date;

    @ApiProperty({ description: 'Updated at of the user' })
    @IsDate()
    updatedAt: Date;

    @ApiProperty({ description: 'Permissions of the user' })
    @IsArray()
    permissions: UsersPermissionsDto[];
  }