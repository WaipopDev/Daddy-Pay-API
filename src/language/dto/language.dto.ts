import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsString, MaxLength } from "class-validator";

export class ResponseLanguageDto {

    @ApiProperty({ description: 'langKey', type: 'string', default: 'hello' })
    @IsString()
    langKey: string;

    @ApiProperty({ description: 'langName', type: 'string', default: 'สวัสดี' })
    @IsString()
    langName: string;
}