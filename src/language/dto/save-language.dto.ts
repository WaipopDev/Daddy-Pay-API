import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString, MaxLength } from 'class-validator';

export class SaveLanguageDto {
    @ApiProperty({ description: 'รหัสภาษา', example: 'TH', maxLength: 10 })
    @IsString()
    @IsNotEmpty()
    @MaxLength(10)
    langCode: string;

    @ApiProperty({ description: 'ชื่อภาษา', example: 'ไทย', maxLength: 100 })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    langName: string;

    @ApiProperty({
        description: 'ข้อความแปล key-value บันทึกที่ Firebase Language/{langCode}',
        example: { menu_dashboard: 'Dashboard', button_save: 'บันทึก' },
    })
    @IsObject()
    @IsNotEmpty()
    translations: Record<string, string>;
}

export class SaveLanguageResponseDto {
    @ApiProperty({ example: 'Language saved to Firebase successfully.' })
    message: string;

    @ApiProperty({ example: 'TH' })
    langCode: string;

    @ApiProperty({ example: 'ไทย' })
    langName: string;
}
