import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
    @ApiProperty({ description: 'Token จากลิงก์ reset password ในอีเมล' })
    @IsString()
    @IsNotEmpty()
    token: string;

    @ApiProperty({ description: 'รหัสผ่านใหม่', minLength: 6, example: 'newPassword123' })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    newPassword: string;
}

export class ResetPasswordResponseDto {
    @ApiProperty({ example: 'Password has been reset successfully.' })
    message: string;
}
