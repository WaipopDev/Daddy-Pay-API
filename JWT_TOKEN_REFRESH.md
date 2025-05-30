# JWT Token Auto-Refresh System

ระบบ JWT Token Auto-Refresh จะช่วยให้ token ของ user ไม่หมดอายุอย่างกะทันหัน โดยจะตรวจสอบและ refresh token อัตโนมัติเมื่อเหลือเวลาน้อยกว่า 10 นาที

## คุณสมบัติ

### 1. การตรวจสอบ Token อัตโนมัติ
- ระบบจะตรวจสอบเวลา expire ของ token ทุกครั้งที่มี request เข้ามา
- ถ้าเหลือเวลาน้อยกว่า **10 นาที** ระบบจะ refresh token อัตโนมัติ
- Token ใหม่จะมีอายุ **1 ชั่วโมง** ตามค่า `JWT_ADMIN_EXPIRE`

### 2. Response Headers
เมื่อ token ถูก refresh อัตโนมัติ ระบบจะส่ง headers กลับมา:
```
X-New-Token: <new_jwt_token>
X-Token-Refreshed: true
```

### 3. Manual Token Refresh
สามารถ refresh token ด้วยตนเองผ่าน API endpoint:

**POST** `/api/v1/admin/auth/refresh-token`

**Headers:**
```
Authorization: Bearer <current_token>
```

**Response:**
```json
{
  "accessToken": "new_jwt_token_here",
  "message": "Token refreshed successfully"
}
```

## การทำงานของระบบ

### ใน AdminAuthGuard
1. แยก token จาก Authorization header
2. เรียก `checkAndRefreshToken()` เพื่อตรวจสอบ token
3. ถ้าต้อง refresh ระบบจะ:
   - สร้าง token ใหม่
   - ส่ง token ใหม่ผ่าน `X-New-Token` header
   - ตั้ง `X-Token-Refreshed: true`
4. ดำเนินการ authorization ตามปกติ

### ใน AdminAuthService
#### `checkAndRefreshToken(token: string)`
- ตรวจสอบเวลา expire ของ token
- ถ้าเหลือเวลา < 10 นาที จะสร้าง token ใหม่
- Return object:
  ```typescript
  {
    shouldRefresh: boolean;
    newToken?: string;
    payload: any;
  }
  ```

#### `refreshTokenByUserId(userId: number)`
- สร้าง token ใหม่สำหรับ user ID ที่กำหนด
- ใช้สำหรับ manual refresh

## การใช้งานใน Frontend

### Auto-Refresh
```javascript
// Interceptor สำหรับตรวจสอบ response headers
axios.interceptors.response.use(
  (response) => {
    // ตรวจสอบว่ามี token ใหม่หรือไม่
    const newToken = response.headers['x-new-token'];
    const tokenRefreshed = response.headers['x-token-refreshed'];
    
    if (tokenRefreshed === 'true' && newToken) {
      // อัปเดต token ใน localStorage หรือ store
      localStorage.setItem('token', newToken);
      console.log('Token refreshed automatically');
    }
    
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

### Manual Refresh
```javascript
const refreshToken = async () => {
  try {
    const response = await axios.post('/api/v1/admin/auth/refresh-token', {}, {
      headers: {
        Authorization: `Bearer ${currentToken}`
      }
    });
    
    const newToken = response.data.accessToken;
    localStorage.setItem('token', newToken);
    console.log('Token refreshed manually');
    
  } catch (error) {
    console.error('Failed to refresh token:', error);
    // Redirect to login
  }
};
```

## การตั้งค่า Environment Variables

```env
JWT_ADMIN_EXPIRE=1h
JWT_ADMIN_SECRET=your_secret_key
```

## ข้อดี

1. **User Experience ดีขึ้น** - User ไม่ถูก logout กะทันหัน
2. **Security** - Token มีอายุสั้น แต่ refresh อัตโนมัติ
3. **Seamless** - ไม่ต้องแก้ไข API calls อื่นๆ
4. **Backward Compatible** - ระบบเดิมยังทำงานได้ปกติ

## ตัวอย่างการทำงาน

1. User login ได้ token ที่มีอายุ 1 ชั่วโมง
2. หลังจาก 50 นาที (เหลือ 10 นาที) user ทำ API call
3. Guard ตรวจสอบพบว่า token เหลือ 10 นาที
4. ระบบสร้าง token ใหม่อายุ 1 ชั่วโมง
5. ส่ง token ใหม่ผ่าน header `X-New-Token`
6. Frontend อัปเดต token ใหม่อัตโนมัติ
7. User ยังคงใช้งานต่อได้โดยไม่ถูก logout

## Error Handling

- ถ้า token หมดอายุแล้ว จะได้ `UnauthorizedException`
- ถ้า user ไม่มีในระบบ จะได้ `UnauthorizedException`
- ถ้า token format ผิด จะได้ `UnauthorizedException`
