import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MaxLength } from 'class-validator';

export class ForgotPasswordDto {
    @ApiProperty({ description: 'อีเมลที่ลงทะเบียนในระบบ', example: 'user@example.com' })
    @IsEmail()
    @MaxLength(100)
    email: string;
}

export class ForgotPasswordResponseDto {
    @ApiProperty({
        description: 'ข้อความตอบกลับเมื่อส่งลิงก์ reset สำเร็จ',
        example: 'A password reset link has been sent to your email.',
    })
    message: string;
}
