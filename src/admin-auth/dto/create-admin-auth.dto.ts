import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, MaxLength } from "class-validator";

export class CreateAdminAuthDto {
    @ApiProperty({ description: 'อีเมล', maxLength: 100, type: 'string', default: 'mail@gmail.com', required: true })
    @IsEmail()
    @MaxLength(100)
    email: string;

    @ApiProperty({ description: 'รหัสผ่าน', maxLength: 255, type: 'string', default: 'password', required: true })
    @MaxLength(255)
    password: string;

    @ApiProperty({ description: 'ชื่อผู้ใช้', maxLength: 255, type: 'string', default: 'username' })
    @MaxLength(255)
    username: string;

    @ApiProperty({ description: 'ระดับการเข้าถึง', maxLength: 100, type: 'string', default: 'user', required: true })
    @MaxLength(100)
    role: string;

    @ApiProperty({ description: 'สถานะการใช้งาน', type: 'boolean', default: true, required: true })
    active: boolean;

    @ApiProperty({ description: 'การสมัครสมาชิก', type: 'boolean', default: false })
    subscribe: boolean;

    @ApiProperty({ description: 'การยืนยัน', type: 'boolean', default: false })
    isVerified: boolean;

    @ApiProperty({ description: 'ระดับการเข้าถึงผู้ดูแลระบบ', type: 'number', default: 0, required: true })
    isAdminLevel: number;

    @ApiProperty({ description: 'วันที่เริ่มการสมัครสมาชิก', type: 'string', nullable: true, example: '2023-01-01T00:00:00Z', required: false })
    subscribeStartDate?: Date;

    @ApiProperty({ description: 'วันที่สิ้นสุดการสมัครสมาชิก', type: 'string', nullable: true, example: '2023-12-31T23:59:59Z', required: false })
    subscribeEndDate?: Date;

}
