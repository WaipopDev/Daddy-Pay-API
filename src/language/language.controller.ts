import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { LanguageService } from './language.service';
import { CreateLanguageListDto, CreateLanguageMainDto } from './dto/create-language.dto';
import { UpdateLanguageMainDto } from './dto/update-language.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/decorators/user.decorator';
import { AdminAuthGuard } from 'src/guards/AuthAdmin.guard';
import { HTTP_STATUS_MESSAGES } from 'src/constants/http-status.constant';

@ApiTags('Language')

@Controller('language')
export class LanguageController {
    constructor(private readonly languageService: LanguageService) { }

    @ApiBearerAuth()
    @UseGuards(AdminAuthGuard)
    @ApiResponse({ status: 200, description: HTTP_STATUS_MESSAGES[200] })
    @ApiResponse({ status: 401, description: HTTP_STATUS_MESSAGES[401] })
    @HttpCode(HttpStatus.OK)
    @Post('main')
    create(@User() userId: number, @Body() createLanguageMainDto: CreateLanguageMainDto) {
        return this.languageService.create(createLanguageMainDto, userId);
    }

    @ApiBearerAuth()
    @UseGuards(AdminAuthGuard)
    @ApiResponse({ status: 200, description: HTTP_STATUS_MESSAGES[200] })
    @ApiResponse({ status: 401, description: HTTP_STATUS_MESSAGES[401] })
    @HttpCode(HttpStatus.OK)
    @Post('list')
    createList(@User() userId: number, @Body() createLanguageListDto: CreateLanguageListDto) {
        return this.languageService.createList(createLanguageListDto, userId);
    }

    @ApiResponse({ status: 200, description: HTTP_STATUS_MESSAGES[200] })
    @ApiResponse({ status: 401, description: HTTP_STATUS_MESSAGES[401] })
    @HttpCode(HttpStatus.OK)
    @Get()
    findByCode(@Query('labgCode') langCode: string) {
        if(!langCode) {
            return new UnauthorizedException('Language code is required.');
        }
        return this.languageService.findByCode(langCode);
    }

    @ApiResponse({ status: 200, description: HTTP_STATUS_MESSAGES[200] })
    @ApiResponse({ status: 401, description: HTTP_STATUS_MESSAGES[401] })
    @HttpCode(HttpStatus.OK)
    @Get('all')
    findAll() {
        return this.languageService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.languageService.findOne(+id);
    }

    @ApiBearerAuth()
    @UseGuards(AdminAuthGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateLanguageDto: UpdateLanguageMainDto) {
        return this.languageService.update(+id, updateLanguageDto);
    }

    @ApiBearerAuth()
    @UseGuards(AdminAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.languageService.remove(+id);
    }
}
