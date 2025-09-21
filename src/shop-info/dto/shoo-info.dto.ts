import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsOptional } from "class-validator";
import { ESort } from "src/constants/query.type";
import { EncodeId } from "src/utility/id-encoder.decorators";

export enum ESortColumn {
  ID = 'id',
  SHOP_NAME = 'shopName',
  SHOP_CODE = 'shopCode',
  SHOP_STATUS = 'shopStatus',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export class SortDto {
  @ApiPropertyOptional({ description: 'เรียงลำดับข้อมูล', enum: ESortColumn })
  @IsOptional()
  @IsEnum(ESortColumn)
  column: ESortColumn = ESortColumn.SHOP_NAME;

  @ApiPropertyOptional({ description: 'เรียงลำดับข้อมูล', enum: ESort })
  @IsEnum(ESort)
  @IsOptional()
  sort: ESort = ESort.DESC;
}

export class ResponseShopInfoListDto {
    @ApiProperty({ description: 'รหัส (เข้ารหัสแล้ว)', type: 'string', example: 'eyJhbGciOiJIUzI1NiJ9' })
    @EncodeId()
    id: number;

    @ApiProperty({ description: 'ชื่อร้านค้า' })
    shopName: string;
}

export class ResponseShopInfoDto {
    @ApiProperty({ description: 'รหัส (เข้ารหัสแล้ว)', type: 'string', example: 'eyJhbGciOiJIUzI1NiJ9' })
    @EncodeId()
    id: number;

    @ApiProperty({ description: 'idKey', example: 1 })
    @IsNumber()
    idKey: number;

    @ApiProperty({ description: 'รหัสร้านค้า', example: 'shop_abc123' })
    shopKey: string;

    @ApiProperty({ description: 'รหัสร้านค้า', example: 'SHOP001' })
    shopCode: string;

    @ApiProperty({ description: 'ชื่อร้านค้า', example: 'ร้านค้าตัวอย่าง' })
    shopName: string;

    @ApiProperty({ description: 'ที่อยู่ร้านค้า', example: '123 ถนนใหญ่ เขตดี จังหวัดดี' })
    shopAddress: string;

    @ApiProperty({ description: 'ข้อมูลติดต่อร้านค้า', example: '02-123-4567' })
    shopContactInfo: string;

    @ApiProperty({ description: 'เบอร์โทรศัพท์มือถือ', example: '081-234-5678' })
    shopMobilePhone: string;

    @ApiProperty({ description: 'อีเมล', example: 'shop@example.com' })
    shopEmail: string;

    @ApiProperty({ description: 'ละติจูด', example: '13.7563' })
    shopLatitude: string;

    @ApiProperty({ description: 'ลองจิจูด', example: '100.5018' })
    shopLongitude: string;

    @ApiProperty({ description: 'สถานะร้านค้า', example: 'active' })
    shopStatus: string;

    @ApiProperty({ description: 'ชื่อระบบร้านค้า', example: 'POS System' })
    shopSystemName: string;

    @ApiProperty({ description: 'ไฟล์อัพโหลด', example: 'https://example.com/file.pdf', required: false })
    shopUploadFile?: string;

    @ApiProperty({ description: 'ชื่อบริษัทในใบกำกับภาษี', example: 'บริษัท ตัวอย่าง จำกัด' })
    shopTaxName: string;

    @ApiProperty({ description: 'เลขประจำตัวผู้เสียภาษี', example: '1234567890123' })
    shopTaxId: string;

    @ApiProperty({ description: 'ที่อยู่ใบกำกับภาษี', example: '123 ถนนใหญ่ เขตดี จังหวัดดี' })
    shopTaxAddress: string;

    @ApiProperty({ description: 'ชื่อบัญชีธนาคาร', example: 'บริษัท ตัวอย่าง จำกัด' })
    shopBankAccount: string;

    @ApiProperty({ description: 'เลขที่บัญชีธนาคาร', example: '123-456-7890' })
    shopBankAccountNumber: string;

    @ApiProperty({ description: 'ชื่อธนาคาร', example: 'ธนาคารกสิกรไทย' })
    shopBankName: string;

    @ApiProperty({ description: 'สาขาธนาคาร', example: 'สาขาสีลม' })
    shopBankBranch: string;

    @ApiProperty({ description: 'วันที่สร้าง', type: 'string', format: 'date-time', example: '2025-05-31T00:00:00.000Z' })
    createdAt: Date;

    @ApiProperty({ description: 'วันที่อัพเดท', type: 'string', format: 'date-time', example: '2025-05-31T00:00:00.000Z' })
    updatedAt: Date;

    @ApiProperty({ description: 'ผู้สร้าง (เข้ารหัสแล้ว)', type: 'string', example: 'eyJhbGciOiJIUzI1NiJ9' })
    @EncodeId()
    createdBy: number;

    @ApiProperty({ description: 'ผู้อัพเดท (เข้ารหัสแล้ว)', type: 'string', example: 'eyJhbGciOiJIUzI1NiJ9' })
    @EncodeId()
    updatedBy: number;
}

export class PaginationMetaDto {
    @ApiProperty({ description: 'จำนวนข้อมูลทั้งหมด', type: 'number', example: 100 })
    totalItems: number;

    @ApiProperty({ description: 'จำนวนข้อมูลในหน้านี้', type: 'number', example: 10 })
    itemCount: number;

    @ApiProperty({ description: 'จำนวนข้อมูลต่อหน้า', type: 'number', example: 10 })
    itemsPerPage: number;

    @ApiProperty({ description: 'จำนวนหน้าทั้งหมด', type: 'number', example: 10 })
    totalPages: number;

    @ApiProperty({ description: 'หน้าปัจจุบัน', type: 'number', example: 1 })
    currentPage: number;
}


export class PaginatedShopInfoResponseDto {
    @ApiProperty({ description: 'รายการข้อมูลร้านค้า', type: [ResponseShopInfoDto] })
    items: ResponseShopInfoDto[];

    @ApiProperty({ description: 'ข้อมูล metadata ของ pagination', type: PaginationMetaDto })
    meta: PaginationMetaDto;

}
