# Shop Info API - Swagger Documentation

## Overview
The Shop Info API `findAll` endpoint now has comprehensive Swagger documentation for the paginated response.

## Swagger Features Added

### 1. Response DTO Structure
- **PaginatedShopInfoResponseDto**: Main response wrapper
- **ResponseShopInfoDto**: Individual shop item structure
- **PaginationMetaDto**: Pagination metadata
- **PaginationLinksDto**: Navigation links

### 2. API Documentation
```typescript
@ApiOperation({ 
    summary: 'ดึงรายการข้อมูลร้านค้าแบบ pagination', 
    description: 'API สำหรับดึงรายการข้อมูลร้านค้าทั้งหมดพร้อมการแบ่งหน้าและการเรียงลำดับ' 
})
```

### 3. Query Parameters Documentation
- **page**: หน้าที่ต้องการ (เริ่มต้นที่ 1)
- **limit**: จำนวนข้อมูลต่อหน้า  
- **column**: ฟิลด์ที่ต้องการเรียงลำดับ
- **sort**: ทิศทางการเรียงลำดับ (ASC/DESC)

### 4. Response Structure
```json
{
  "items": [
    {
      "id": 1,
      "shopKey": "shop_abc123",
      "shopCode": "SHOP001",
      "shopName": "ร้านค้าตัวอย่าง",
      "shopAddress": "123 ถนนใหญ่ เขตดี จังหวัดดี",
      "shopContactInfo": "02-123-4567",
      "shopMobilePhone": "081-234-5678",
      "shopEmail": "shop@example.com",
      "shopLatitude": "13.7563",
      "shopLongitude": "100.5018",
      "shopStatus": "active",
      "shopSystemName": "POS System",
      "shopUploadFile": "https://example.com/file.pdf",
      "shopTaxName": "บริษัท ตัวอย่าง จำกัด",
      "shopTaxId": "1234567890123",
      "shopTaxAddress": "123 ถนนใหญ่ เขตดี จังหวัดดี",
      "shopBankAccount": "บริษัท ตัวอย่าง จำกัด",
      "shopBankAccountNumber": "123-456-7890",
      "shopBankName": "ธนาคารกสิกรไทย",
      "shopBankBranch": "สาขาสีลม",
      "createdAt": "2025-05-31T00:00:00.000Z",
      "updatedAt": "2025-05-31T00:00:00.000Z",
      "createdBy": 1,
      "updatedBy": 1
    }
  ],
  "meta": {
    "totalItems": 100,
    "itemCount": 10,
    "itemsPerPage": 10,
    "totalPages": 10,
    "currentPage": 1
  },
  "links": {
    "first": "http://localhost:3000/shop-info?limit=10",
    "previous": "",
    "next": "http://localhost:3000/shop-info?page=2&limit=10",
    "last": "http://localhost:3000/shop-info?page=10&limit=10"
  }
}
```

## Swagger UI Features

### 1. Interactive Documentation
- Complete parameter documentation with examples
- Response schema with all field descriptions
- Try-it-out functionality with sample requests

### 2. Query Parameter Options
- **Sorting Fields**: id, shopName, shopCode, shopStatus, createdAt, updatedAt
- **Sort Directions**: ASC, DESC
- **Pagination**: page and limit parameters with defaults

### 3. Response Examples
- Success response (200) with complete data structure
- Error response (401) for unauthorized access

## Benefits
- **Developer Experience**: Clear API documentation for frontend developers
- **Type Safety**: TypeScript interfaces align with Swagger schemas
- **Testing**: Interactive testing directly from Swagger UI
- **Maintenance**: Self-documenting API reduces documentation overhead

## Access Swagger UI
Visit: `http://localhost:3000/api` (or your configured Swagger path)
Navigate to: **Shop Info** → **GET /shop-info**
