import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { HTTP_STATUS_MESSAGES } from 'src/constants/http-status.constant';
import { AuthDTO } from './dto/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Get(':idIoT')
    @ApiResponse({ status: 200, description:  HTTP_STATUS_MESSAGES[200], type: AuthDTO })
    @ApiResponse({ status: 401, description: HTTP_STATUS_MESSAGES[401] })
    @HttpCode(HttpStatus.OK)
    async authKeyIoT(
        @Query('idIoT') idIoT: string,
    ): Promise<AuthDTO> {
        const keyAuth = await this.authService.getKeyAuth(idIoT);
        return keyAuth;
    }
}
