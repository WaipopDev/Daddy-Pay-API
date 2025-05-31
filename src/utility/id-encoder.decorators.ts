import { Transform } from 'class-transformer';
import { IdEncoderService } from './id-encoder.service';

/**
 * Decorator สำหรับเข้ารหัส ID ตอนส่งข้อมูลออกไป (serialization)
 * ใช้กับ DTO fields ที่เป็น ID
 */
export function EncodeId() {
    return Transform(({ value }) => {
        if (value === null || value === undefined) {
            return value;
        }
        if (typeof value === 'number') {
            return IdEncoderService.encode(value);
        }
        return value;
    }, { toPlainOnly: true });
}

/**
 * Decorator สำหรับถอดรหัส ID ตอนรับข้อมูลเข้ามา (deserialization)
 * ใช้กับ DTO fields ที่รับ encoded ID จาก frontend
 */
export function DecodeId() {
    return Transform(({ value }) => {
        if (value === null || value === undefined) {
            return value;
        }
        if (typeof value === 'string') {
            return IdEncoderService.decode(value);
        }
        return value;
    }, { toClassOnly: true });
}

/**
 * Decorator สำหรับเข้ารหัส array ของ IDs
 */
export function EncodeIdArray() {
    return Transform(({ value }) => {
        if (!Array.isArray(value)) {
            return value;
        }
        return value.map((id: number) => {
            if (typeof id === 'number') {
                return IdEncoderService.encode(id);
            }
            return id;
        });
    }, { toPlainOnly: true });
}

/**
 * Decorator สำหรับถอดรหัส array ของ encoded IDs
 */
export function DecodeIdArray() {
    return Transform(({ value }) => {
        if (!Array.isArray(value)) {
            return value;
        }
        return value.map((encodedId: string) => {
            if (typeof encodedId === 'string') {
                return IdEncoderService.decode(encodedId);
            }
            return encodedId;
        });
    }, { toClassOnly: true });
}
