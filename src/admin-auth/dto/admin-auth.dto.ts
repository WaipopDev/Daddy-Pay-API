import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, MaxLength } from "class-validator";

export class LoginAdminAuthDto {
    @ApiProperty({ description: 'อีเมล', maxLength: 100, type: 'string', default: '' })
    @IsEmail()
    @MaxLength(100)
    email: string;

    @ApiProperty({ description: 'รหัสผ่าน', maxLength: 255, type: 'string', default: '' })
    @MaxLength(255)
    password: string;
}

export class ResponseAdminAuthDto {
    @ApiProperty({ description: 'รหัสผู้ใช้', type: 'number', default: 0 })
    id: number;

    @ApiProperty({ description: 'Token สำหรับเข้าใช้งานระบบ' })
    accessToken: string;
}

export class RefreshTokenResponseDto {
    @ApiProperty({ description: 'Token ใหม่สำหรับเข้าใช้งานระบบ' })
    accessToken: string;

    @ApiProperty({ description: 'ข้อความตอบกลับ', default: 'Token refreshed successfully' })
    message: string;
}

export class TokenValidationResponseDto {
    @ApiProperty({ description: 'ระบุว่าควร refresh token หรือไม่' })
    shouldRefresh: boolean;

    @ApiProperty({ description: 'Token ใหม่ (ถ้ามีการ refresh)', required: false })
    newToken?: string;

    @ApiProperty({ description: 'ข้อมูลใน token payload' })
    payload: any;
}