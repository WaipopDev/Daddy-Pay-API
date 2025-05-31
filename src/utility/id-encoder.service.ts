import * as crypto from 'crypto';

export class IdEncoderService {
    private static readonly SECRET_KEY = process.env.ID_ENCODER_SECRET || 'default-secret-key-change-in-production';
    private static readonly ALGORITHM = 'aes-256-cbc';
    private static readonly IV_LENGTH = 16; // For AES, this is always 16

    /**
     * เข้ารหัส ID ก่อนส่งให้ frontend
     * @param id - ID ที่ต้องการเข้ารหัส
     * @returns string - ID ที่เข้ารหัสแล้ว
     */
    static encode(id: number): string {
        try {
            const iv = crypto.randomBytes(this.IV_LENGTH);
            const key = crypto.createHash('sha256').update(this.SECRET_KEY).digest();
            const cipher = crypto.createCipheriv(this.ALGORITHM, key, iv);
            
            let encrypted = cipher.update(id.toString(), 'utf8', 'hex');
            encrypted += cipher.final('hex');
            
            // รวม IV กับข้อมูลที่เข้ารหัส
            const result = iv.toString('hex') + ':' + encrypted;
            
            // เข้ารหัสด้วย base64 เพื่อให้ URL safe
            return Buffer.from(result).toString('base64url');
        } catch (error) {
            console.error('Error encoding ID:', error);
            throw new Error('Failed to encode ID');
        }
    }

    /**
     * ถอดรหัส ID ที่ได้รับจาก frontend
     * @param encodedId - ID ที่เข้ารหัสแล้ว
     * @returns number - ID ที่ถอดรหัสแล้ว
     */
    static decode(encodedId: string): number {
        try {
            // ถอดรหัส base64
            const decoded = Buffer.from(encodedId, 'base64url').toString();
            const [ivHex, encrypted] = decoded.split(':');
            
            if (!ivHex || !encrypted) {
                throw new Error('Invalid encoded ID format');
            }

            const iv = Buffer.from(ivHex, 'hex');
            const key = crypto.createHash('sha256').update(this.SECRET_KEY).digest();
            const decipher = crypto.createDecipheriv(this.ALGORITHM, key, iv);
            
            let decrypted = decipher.update(encrypted, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            
            const id = parseInt(decrypted, 10);
            
            if (isNaN(id) || id <= 0) {
                throw new Error('Invalid decoded ID');
            }
            
            return id;
        } catch (error) {
            console.error('Error decoding ID:', error);
            throw new Error('Failed to decode ID');
        }
    }

    /**
     * เข้ารหัส array ของ IDs
     * @param ids - array ของ IDs ที่ต้องการเข้ารหัส
     * @returns string[] - array ของ IDs ที่เข้ารหัสแล้ว
     */
    static encodeArray(ids: number[]): string[] {
        return ids.map(id => this.encode(id));
    }

    /**
     * ถอดรหัส array ของ encoded IDs
     * @param encodedIds - array ของ encoded IDs
     * @returns number[] - array ของ IDs ที่ถอดรหัสแล้ว
     */
    static decodeArray(encodedIds: string[]): number[] {
        return encodedIds.map(encodedId => this.decode(encodedId));
    }

    /**
     * ตรวจสอบว่า encoded ID ถูกต้องหรือไม่
     * @param encodedId - ID ที่เข้ารหัสแล้ว
     * @returns boolean - true ถ้าถูกต้อง
     */
    static isValidEncodedId(encodedId: string): boolean {
        try {
            const decoded = this.decode(encodedId);
            return Number.isInteger(decoded) && decoded > 0;
        } catch {
            return false;
        }
    }
}
