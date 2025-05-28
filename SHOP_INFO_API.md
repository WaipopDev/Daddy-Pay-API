# Shop Info API Documentation

## Overview
The Shop Info API provides endpoints for managing shop information with file upload capabilities to Firebase Storage.

## Endpoints

### POST /api/v1/shop-info
Creates a new shop with file upload support.

#### Request Format
- **Content-Type**: `multipart/form-data`
- **Authentication**: Bearer Token required

#### Form Data Fields

| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `shopCode` | string | ✅ | Unique shop code (max 255 chars) |
| `shopName` | string | ✅ | Shop name (max 255 chars) |
| `shopStatus` | enum | ✅ | Shop status: `active`, `inactive`, `suspended` |
| `shopSystemName` | string | ✅ | System name for the shop (max 255 chars) |
| `shopBankAccount` | string | ✅ | Bank account name (max 255 chars) |
| `shopBankAccountNumber` | string | ✅ | Bank account number (max 255 chars) |
| `shopBankName` | string | ✅ | Bank name (max 255 chars) |
| `shopBankBranch` | string | ✅ | Bank branch (max 255 chars) |
| `shopUploadFile` | file | ❌ | Shop document/image file |
| `shopAddress` | string | ❌ | Shop address |
| `shopContactInfo` | string | ❌ | Contact information (max 255 chars) |
| `shopMobilePhone` | string | ❌ | Mobile phone (max 20 chars) |
| `shopEmail` | string | ❌ | Email address (max 100 chars) |
| `shopLatitude` | string | ❌ | GPS latitude (max 255 chars) |
| `shopLongitude` | string | ❌ | GPS longitude (max 255 chars) |
| `shopTaxName` | string | ❌ | Tax name (max 255 chars) |
| `shopTaxId` | string | ❌ | Tax ID (max 255 chars) |
| `shopTaxAddress` | string | ❌ | Tax address |

#### File Upload Specifications
- **Supported formats**: JPG, JPEG, PNG, PDF, DOC, DOCX
- **Maximum file size**: 10MB
- **Storage**: Firebase Cloud Storage
- **URL**: Automatically generated and stored in database

#### Auto-Generated Fields
- `shopKey`: 10-character unique alphanumeric key (auto-generated)
- `createdAt`: Timestamp of creation
- `updatedAt`: Timestamp of last update
- `createdBy`: User ID who created the record
- `updatedBy`: User ID who last updated the record

#### Response

##### Success (200)
```json
{
  "id": 123
}
```

##### Error (400)
```json
{
  "message": "File size exceeds maximum allowed size of 10MB",
  "statusCode": 400
}
```

##### Error (401)
```json
{
  "message": "Unauthorized",
  "statusCode": 401
}
```

#### cURL Example
```bash
curl -X POST \
  http://localhost:3000/api/v1/shop-info \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: multipart/form-data' \
  -F 'shopCode=SHOP001' \
  -F 'shopName=My Test Shop' \
  -F 'shopStatus=active' \
  -F 'shopSystemName=TestSystem' \
  -F 'shopBankAccount=John Doe' \
  -F 'shopBankAccountNumber=1234567890' \
  -F 'shopBankName=Test Bank' \
  -F 'shopBankBranch=Main Branch' \
  -F 'shopUploadFile=@/path/to/document.pdf'
```

### GET /api/v1/shop-info
Retrieves all shop information records.

#### Response
```json
[
  {
    "id": 1,
    "shopKey": "ABC123XYZ0",
    "shopCode": "SHOP001",
    "shopName": "My Test Shop",
    "shopAddress": "123 Main St",
    "shopContactInfo": "Contact info",
    "shopMobilePhone": "0123456789",
    "shopEmail": "shop@example.com",
    "shopLatitude": "13.7563",
    "shopLongitude": "100.5018",
    "shopStatus": "active",
    "shopSystemName": "TestSystem",
    "shopUploadFile": "https://storage.googleapis.com/bucket/shop-files/shop-123456789-document.pdf",
    "shopTaxName": "Tax Name",
    "shopTaxId": "1234567890",
    "shopTaxAddress": "Tax Address",
    "shopBankAccount": "John Doe",
    "shopBankAccountNumber": "1234567890",
    "shopBankName": "Test Bank",
    "shopBankBranch": "Main Branch",
    "createdAt": "2025-05-29T10:00:00.000Z",
    "updatedAt": "2025-05-29T10:00:00.000Z",
    "createdBy": 1,
    "updatedBy": 1
  }
]
```

### GET /api/v1/shop-info/:id
Retrieves a specific shop information record by ID.

### PATCH /api/v1/shop-info/:id
Updates a specific shop information record.

### DELETE /api/v1/shop-info/:id
Soft deletes a specific shop information record.

## Additional Repository Methods

### Service Methods
- `findByShopCode(shopCode: string)`: Find shop by unique code
- `findByShopKey(shopKey: string)`: Find shop by unique key
- `findActiveShops()`: Get only active shops
- `checkShopCodeExists(shopCode: string)`: Check if shop code exists
- `checkShopKeyExists(shopKey: string)`: Check if shop key exists

## Environment Variables Required

```env
# Firebase Configuration
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com

# Database Configuration
PG_HOST=localhost
PG_PORT=5432
PG_USER=your_db_user
PG_PASSWORD=your_db_password
PG_DATABASE=daddy_pay_db
```

## Firebase Setup

1. Create a Firebase project
2. Enable Cloud Storage
3. Download the service account key as `firebase-key.json`
4. Place the key file in the project root
5. Set the `FIREBASE_STORAGE_BUCKET` environment variable

## Security Features

- Bearer token authentication required
- File type validation (images and documents only)
- File size limits (10MB maximum)
- Unique shop code and key validation
- Auto-generated unique shop keys (10 characters)

## Error Handling

The API provides comprehensive error handling for:
- Invalid file types
- File size exceeded
- Duplicate shop codes
- Missing required fields
- Firebase upload failures
- Authentication errors
