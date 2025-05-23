import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsString, MaxLength } from "class-validator";

export class CreateLanguageMainDto {
    @ApiProperty({ description: 'langCode', maxLength: 10, type: 'string', default: 'th', required: true })
    @IsString()
    @MaxLength(10)
    langCode: string;

    @ApiProperty({ description: 'langName', maxLength: 100, type: 'string', default: 'Thai', required: true })
    @IsString()
    @MaxLength(100)
    langName: string;

    @ApiProperty({ description: 'active', type: 'boolean', default: true, required: false })
    @IsBoolean()
    active: boolean;
}

export class CreateLanguageListDto {
    @ApiProperty({ description: 'langMainId', type: 'number', required: true })
    @IsNumber()
    langMainId: number;

    @ApiProperty({ description: 'langKey', type: 'string', default: 'hello', required: true })
    @IsString()
    langKey: string;

    @ApiProperty({ description: 'langName', type: 'string', default: 'สวัสดี', required: true })
    @IsString()
    langName: string;
}