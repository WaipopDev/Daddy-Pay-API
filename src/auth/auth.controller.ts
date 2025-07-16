import { Controller, Get, HttpCode, HttpStatus, Param, Query, UnauthorizedException } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { HTTP_STATUS_MESSAGES } from 'src/constants/http-status.constant';
import { AuthDTO } from './dto/auth.dto';

@ApiTags('IoT-Auth')
@Controller('iot-auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @ApiResponse({ status: 200, description:  HTTP_STATUS_MESSAGES[200], type: AuthDTO })
    @ApiResponse({ status: 401, description: HTTP_STATUS_MESSAGES[401] })
    @HttpCode(HttpStatus.OK)
    @Get(':idIoT')
    async authKeyIoT(
        @Param('idIoT') id: string,
    ): Promise<AuthDTO> {
        if (!id) {
            throw new UnauthorizedException('Please provide a valid idIoT.');
        }
        try {
            const keyAuth = await this.authService.getKeyAuth(id);
            return keyAuth;
        } catch (error) {
            console.log("🚀 ~ AuthController ~ error:", error)
            throw new UnauthorizedException('An error occurred while processing your request.');
            
        }
    }
}
