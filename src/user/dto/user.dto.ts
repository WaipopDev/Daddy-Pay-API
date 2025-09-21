import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
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