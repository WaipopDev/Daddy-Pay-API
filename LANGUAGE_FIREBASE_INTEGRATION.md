# Language Repository - Firebase Realtime Database Integration

## การเปลี่ยนแปลง

### 1. เปลี่ยนจาก TypeORM เป็น Firebase Realtime Database

เปลี่ยนการดึงข้อมูลใน method `findByCode` ใน `LanguageRepository` จากการใช้ TypeORM query เป็นการดึงข้อมูลจาก Firebase Realtime Database

### 2. โครงสร้างข้อมูลใน Firebase Realtime Database

```json
{
  "Language": {
    "TH": {
      "langCode": "TH",
      "langName": "ไทย", 
      "active": true,
      "welcome": "ยินดีต้อนรับ",
      "login": "เข้าสู่ระบบ",
      "logout": "ออกจากระบบ",
      // ... อื่นๆ
    },
    "EN": {
      "langCode": "EN",
      "langName": "English",
      "active": true,
      "welcome": "Welcome",
      "login": "Login", 
      "logout": "Logout",
      // ... อื่นๆ
    }
  }
}
```

### 3. การทำงานของ method `findByCode`

- รับ parameter `code` (เช่น "TH")
- เชื่อมต่อไปยัง Firebase Realtime Database path: `Language/{code}`
- ดึงข้อมูลและแปลงเป็น `ResponseLanguageDto[]` format
- กรองเฉพาะ key ที่ไม่ใช่ metadata (langCode, langName, active)
- เรียงลำดับผลลัพธ์ตาม langKey

### 4. ไฟล์ที่ถูกแก้ไข

1. **`/src/firebase/firebase.service.ts`**
   - เพิ่ม `databaseURL` ใน Firebase configuration
   - เพิ่ม method `getDatabase()` สำหรับเข้าถึง Realtime Database

2. **`/src/repositories/Language.repository.ts`**
   - เพิ่ม import `FirebaseService`
   - เพิ่ม FirebaseService ใน constructor
   - แทนที่ method `findByCode` ด้วยการใช้ Firebase Realtime Database

3. **`/src/language/language.module.ts`**
   - เพิ่ม import `FirebaseModule`

4. **`.env`**
   - เพิ่ม `FIREBASE_DATABASE_URL` environment variable

### 5. Environment Variables Required

```env
FIREBASE_DATABASE_URL=https://your-project-default-rtdb.region.firebasedatabase.app/
FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app  
```

### 6. วิธีการใช้งาน

```typescript
// เรียกใช้ในเดิม service
const languageData = await this.languageRepository.findByCode('TH');

// ผลลัพธ์ที่ได้
[
  { langKey: 'add', langName: 'เพิ่ม' },
  { langKey: 'cancel', langName: 'ยกเลิก' },
  { langKey: 'close', langName: 'ปิด' },
  // ... อื่นๆ เรียงตาม langKey
]
```

### 7. ข้อดีของการเปลี่ยนแปลง

- **Real-time updates**: ข้อมูลภาษาสามารถอัปเดตแบบ real-time ได้
- **Scalability**: ไม่ต้องพึ่งพา database server สำหรับข้อมูลภาษา
- **Performance**: ลดการ query database สำหรับข้อมูลที่ไม่เปลี่ยนแปลงบ่อย
- **Multi-language support**: ง่ายต่อการเพิ่มภาษาใหม่โดยไม่ต้องแก้ไข database schema

### 8. การตั้งค่าข้อมูลใน Firebase

ใช้ไฟล์ `firebase-language-structure.json` เป็นตัวอย่างโครงสร้างข้อมูลที่ต้องใส่ใน Firebase Realtime Database

**Path**: `/Language/TH` สำหรับข้อมูลภาษาไทย
**Path**: `/Language/EN` สำหรับข้อมูลภาษาอังกฤษ
