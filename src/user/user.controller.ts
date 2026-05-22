import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ClassSerializerInterceptor, UseGuards, Query, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserSubscribeDto } from './dto/update-user-subscribe.dto';
import { AdminAuthGuard } from 'src/guards/AuthAdmin.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HTTP_STATUS_MESSAGES } from 'src/constants/http-status.constant';
import { QueryUserDto } from './dto/user.dto';
import { User } from 'src/decorators/user.decorator';

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(AdminAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @ApiResponse({ status: 200, description: HTTP_STATUS_MESSAGES[200] })
    @ApiResponse({ status: 401, description: HTTP_STATUS_MESSAGES[401] })
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        try {
            return this.userService.create(createUserDto);
        } catch (error) {
            console.log("message", error.message);
            throw new BadRequestException(error.message);
        }
    }

    @ApiResponse({ status: 200, description: HTTP_STATUS_MESSAGES[200] })
    @ApiResponse({ status: 401, description: HTTP_STATUS_MESSAGES[401] })
    @Get()
    findAll(@Query() query: QueryUserDto) {
        return this.userService.findAll(query);
    }

    @ApiResponse({ status: 200, description: HTTP_STATUS_MESSAGES[200] })
    @ApiResponse({ status: 401, description: HTTP_STATUS_MESSAGES[401] })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.userService.findOne(+id);
    }

    @ApiOperation({
        summary: 'อัพเดทข้อมูลการสมัครสมาชิก',
        description: 'อัพเดท subscribe, subscribeStartDate, subscribeEndDate',
    })
    @ApiResponse({ status: 200, description: HTTP_STATUS_MESSAGES[200] })
    @ApiResponse({ status: 401, description: HTTP_STATUS_MESSAGES[401] })
    @ApiResponse({ status: 404, description: 'ไม่พบผู้ใช้' })
    @Patch('subscribe/:id')
    updateSubscribe(
        @User() updatedBy: number,
        @Param('id') id: string,
        @Body() body: UpdateUserSubscribeDto,
    ) {
        return this.userService.updateSubscribe(+id, body, updatedBy);
    }

    @ApiResponse({ status: 200, description: HTTP_STATUS_MESSAGES[200] })
    @ApiResponse({ status: 401, description: HTTP_STATUS_MESSAGES[401] })
    @Patch('change-password')
    changePassword(@User() userId: number, @Body() changePasswordDto: ChangePasswordDto) {
        try {
            return this.userService.changePassword(userId, changePasswordDto);
        } catch (error) {
            console.log("message", error.message);
            throw new BadRequestException(error.message);
        }
    }

    @ApiResponse({ status: 200, description: HTTP_STATUS_MESSAGES[200] })
    @ApiResponse({ status: 401, description: HTTP_STATUS_MESSAGES[401] })
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(+id, updateUserDto);
    }

    @ApiResponse({ status: 200, description: HTTP_STATUS_MESSAGES[200] })
    @ApiResponse({ status: 401, description: HTTP_STATUS_MESSAGES[401] })
    @Delete(':id')
    remove(@Param('id') id: string) {
        console.log('id', id)
        return this.userService.remove(+id);
    }
}
