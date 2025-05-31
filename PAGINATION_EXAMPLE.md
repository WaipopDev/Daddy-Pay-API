# Pagination Example for Shop Info API

## Overview
The Shop Info API now supports pagination and sorting using `nestjs-typeorm-paginate` library.

## API Endpoint
```
GET /shop-info?page=1&limit=10&column=shopName&sort=ASC
```

## Query Parameters

### Pagination
- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of items per page (default: 10)

### Sorting
- `column` (optional): Field to sort by (default: shopName)
  - Available options: `id`, `shopName`, `shopCode`, `shopStatus`, `createdAt`, `updatedAt`
- `sort` (optional): Sort direction (default: DESC)
  - Available options: `ASC`, `DESC`

## Response Format
```json
{
  "items": [
    {
      "id": 1,
      "shopKey": "shop_123",
      "shopCode": "SHOP001",
      "shopName": "Example Shop",
      "shopAddress": "123 Main St",
      "shopStatus": "active",
      "createdAt": "2025-05-31T00:00:00.000Z",
      "updatedAt": "2025-05-31T00:00:00.000Z"
      // ... other shop fields
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

## Example Usage

### Get first page with 10 items, sorted by shop name ascending
```bash
curl -X GET "http://localhost:3000/shop-info?page=1&limit=10&column=shopName&sort=ASC" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get second page with 20 items, sorted by creation date descending
```bash
curl -X GET "http://localhost:3000/shop-info?page=2&limit=20&column=createdAt&sort=DESC" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get shops sorted by status
```bash
curl -X GET "http://localhost:3000/shop-info?column=shopStatus&sort=ASC" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Implementation Details

The pagination is implemented using:
- **Repository**: Uses `nestjs-typeorm-paginate` with QueryBuilder for efficient database queries
- **Service**: Returns `Pagination<ShopInfoEntity>` object with metadata
- **Controller**: Accepts `PaginationDto` and `SortDto` query parameters

### Benefits
- Efficient database queries with LIMIT and OFFSET
- Consistent response format across the application
- Automatic metadata calculation (total pages, current page, etc.)
- Navigation links for easy pagination implementation on frontend
