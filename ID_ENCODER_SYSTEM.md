# Global ID Encoding/Decoding System

## Overview
This system provides secure ID encoding/decoding functionality for the NestJS TypeORM API, specifically designed to hide internal database IDs from external users while maintaining API functionality.

## Features
- **AES-256-CBC Encryption**: Secure encryption with random initialization vectors
- **URL-Safe Encoding**: Base64URL encoding for API compatibility
- **Automatic Transformation**: Decorators for seamless ID transformation
- **Array Support**: Batch encoding/decoding for arrays of IDs
- **Validation**: Built-in validation for encoded ID formats
- **Error Handling**: Comprehensive error handling with custom exceptions

## Core Components

### 1. IdEncoderService (`src/utility/id-encoder.service.ts`)
The main service that handles encryption and decryption:

```typescript
// Encode a single ID
const encodedId = IdEncoderService.encode(123);

// Decode a single ID
const originalId = IdEncoderService.decode(encodedId);

// Encode array of IDs
const encodedIds = IdEncoderService.encodeArray([1, 2, 3]);

// Decode array of IDs
const originalIds = IdEncoderService.decodeArray(encodedIds);

// Validate encoded ID
const isValid = IdEncoderService.isValidEncodedId(encodedId);
```

### 2. Transformation Decorators (`src/utility/id-encoder.decorators.ts`)
Automatic transformation decorators for DTOs:

```typescript
export class ResponseDto {
    @EncodeId()
    @Expose()
    id: string;

    @EncodeIdArray()
    @Expose()
    relatedIds: string[];
}
```

### 3. Validation Decorators (`src/utility/id-encoder.validators.ts`)
Custom validators for request validation:

```typescript
export class RequestDto {
    @IsValidEncodedId()
    id: string;

    @IsValidEncodedIdArray()
    ids: string[];
}
```

### 4. Response Transformation (`src/Interceptors/transform.interceptor.ts`)
Automatic transformation of response data using class-transformer.

### 5. Error Handling (`src/filters/id-encoder-exception.filter.ts`)
Custom exception filter for ID encoding/decoding errors.

## Implementation Example

### Controller Usage
```typescript
@Controller('shop-info')
export class ShopInfoController {
    @Get(':id')
    async findOne(@Param('id') encodedId: string) {
        try {
            const id = IdEncoderService.decode(encodedId);
            return this.shopInfoService.findOne(id);
        } catch (error) {
            throw new BadRequestException('Invalid shop ID format');
        }
    }
}
```

### DTO Configuration
```typescript
export class ResponseShopInfoDto {
    @EncodeId()
    @Expose()
    id: string;

    @Expose()
    shopName: string;

    @EncodeId()
    @Expose()
    createdBy: string;

    @EncodeId()
    @Expose()
    updatedBy: string;
}
```

## Security Features

### Encryption Details
- **Algorithm**: AES-256-CBC
- **Key Derivation**: SHA-256 hash of secret key
- **Initialization Vector**: Random 16-byte IV per encryption
- **Encoding**: Base64URL for URL safety

### Environment Configuration
```bash
# Required environment variable
ID_ENCODER_SECRET=your-super-secret-key-for-production-change-this-immediately-and-make-it-long-and-random
```

## API Examples

### Before (Raw IDs)
```json
GET /shop-info/123
{
  "id": 123,
  "shopName": "Test Shop",
  "createdBy": 456
}
```

### After (Encoded IDs)
```json
GET /shop-info/YTA4NGYxNDA3YjZiZmI0NTA4NDJhODdhMjExZGFjN2U6OTVkMzA3YTQ5ODQwNzZmNDY0NjNjZjNhOTg1MGM2NmI
{
  "id": "YTA4NGYxNDA3YjZiZmI0NTA4NDJhODdhMjExZGFjN2U6OTVkMzA3YTQ5ODQwNzZmNDY0NjNjZjNhOTg1MGM2NmI",
  "shopName": "Test Shop",
  "createdBy": "bXVuaXRlZDQ5YjZiZmI0NTA4NDJhODdhMjExZGFjN2U6OTVkMzA3YTQ5ODQwNzZmNDY0NjNjZjNhOTg1MGM2NmI"
}
```

## Module Integration

### Shop Info Module
```typescript
@Module({
  imports: [AdminAuthModule, FirebaseModule],
  controllers: [ShopInfoController],
  providers: [
    ShopInfoService, 
    ShopInfoRepository,
    IdEncoderService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: IdEncoderExceptionFilter,
    },
  ],
})
export class ShopInfoModule {}
```

## Testing

### Unit Tests
- Encoding/decoding functionality
- Array operations
- Validation methods
- Error handling
- URL safety verification

### Integration Tests
- End-to-end ID transformation
- API request/response validation
- Error handling in controllers

## Benefits

1. **Security**: Database IDs are never exposed externally
2. **Consistency**: Uniform ID handling across all APIs
3. **Maintainability**: Centralized encoding logic
4. **Performance**: Efficient encryption with minimal overhead
5. **Flexibility**: Easy to apply to any entity with decorators

## Best Practices

1. **Environment Variables**: Always use strong, random secrets in production
2. **Error Handling**: Always wrap decode operations in try-catch blocks
3. **Validation**: Use validation decorators for request DTOs
4. **Documentation**: Update Swagger documentation with encoded ID examples
5. **Testing**: Thoroughly test encoding/decoding with various ID values

## Production Checklist

- [ ] Set strong `ID_ENCODER_SECRET` in production environment
- [ ] Verify all API endpoints use encoded IDs
- [ ] Update API documentation with encoded ID examples
- [ ] Test error handling for invalid encoded IDs
- [ ] Monitor performance impact of encryption operations
- [ ] Implement logging for suspicious decode attempts (optional)

## Troubleshooting

### Common Issues

1. **"Invalid encoded ID format"**: Check if the encoded ID is properly base64url encoded
2. **"Failed to decode ID"**: Verify the secret key matches between encoding and decoding
3. **TypeScript errors**: Ensure all decorators are properly imported
4. **Missing transformations**: Check if TransformInterceptor is registered in the module

### Debug Commands
```bash
# Test encoding/decoding
node -e "
const crypto = require('crypto');
const key = crypto.createHash('sha256').update('your-secret').digest();
console.log('Key length:', key.length);
"

# Verify environment
echo $ID_ENCODER_SECRET
```
