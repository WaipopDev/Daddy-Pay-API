import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UnauthorizedException, UseGuards, Req } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { CreateAdminAuthDto } from './dto/create-admin-auth.dto';
import { UpdateAdminAuthDto } from './dto/update-admin-auth.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginAdminAuthDto, ResponseAdminAuthDto, RefreshTokenResponseDto } from './dto/admin-auth.dto';
import { HTTP_STATUS_MESSAGES } from 'src/constants/http-status.constant';
import { AdminAuthGuard } from 'src/guards/AuthAdmin.guard';
import { User } from 'src/decorators/user.decorator';

@ApiTags('AdminAuth')
@Controller('admin/auth')
export class AdminAuthController {
    constructor(private readonly adminAuthService: AdminAuthService) { }

    @Post('create')
    create(@Body() createAdminAuthDto: CreateAdminAuthDto) {
        const { email, password, role, active, isAdminLevel } = createAdminAuthDto;
        if (!email || !password || !role || !active || !isAdminLevel) {
            throw new UnauthorizedException('Please enter your email, password, access level, user status, and administrator access level.');
        }
        return this.adminAuthService.create(createAdminAuthDto);
    }

    @ApiResponse({ status: 200, description: HTTP_STATUS_MESSAGES[200] })
    @ApiResponse({ status: 401, description: HTTP_STATUS_MESSAGES[401] })
    @HttpCode(HttpStatus.OK)
    @Post('signin')
    login(@Body() loginAdminAuthDto: LoginAdminAuthDto): Promise<ResponseAdminAuthDto> {
        const { email, password } = loginAdminAuthDto;
        if (!email || !password) {
            throw new UnauthorizedException('Please enter your email and password.');
        }
        return this.adminAuthService.login(loginAdminAuthDto);
    }

    @ApiBearerAuth()
    @UseGuards(AdminAuthGuard)
    @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
    @ApiResponse({ status: 401, description: HTTP_STATUS_MESSAGES[401] })
    @HttpCode(HttpStatus.OK)
    @Post('refresh-token')
    async refreshToken(@User() userId: number): Promise<RefreshTokenResponseDto> {
        const newToken = await this.adminAuthService.refreshTokenByUserId(userId);
        return {
            accessToken: newToken,
            message: 'Token refreshed successfully'
        };
    }

    @Get()
    findAll() {
        return this.adminAuthService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.adminAuthService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateAdminAuthDto: UpdateAdminAuthDto) {
        return this.adminAuthService.update(+id, updateAdminAuthDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.adminAuthService.remove(+id);
    }
}
