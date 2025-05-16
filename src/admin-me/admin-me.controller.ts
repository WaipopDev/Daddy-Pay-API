import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AdminMeService } from './admin-me.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HTTP_STATUS_MESSAGES } from 'src/constants/http-status.constant';
import { AdminAuthGuard } from 'src/guards/AuthAdmin.guard';
import { User } from 'src/decorators/user.decorator';

@ApiTags('AdminMe')
@ApiBearerAuth()
@UseGuards(AdminAuthGuard)
@Controller('admin/me')
export class AdminMeController {
    constructor(private readonly adminMeService: AdminMeService) { }

    @ApiResponse({ status: 200, description: HTTP_STATUS_MESSAGES[200] })
    @ApiResponse({ status: 401, description: HTTP_STATUS_MESSAGES[401] })
    @HttpCode(HttpStatus.OK)
    @Get()
    getProfile(@User() userId: number) {
        return this.adminMeService.getProfile(userId);
    }


}
