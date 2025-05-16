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