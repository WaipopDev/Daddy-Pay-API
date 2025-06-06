import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    HttpCode,
    HttpStatus,
    UseGuards,
    UseInterceptors,
    Query,
    BadRequestException,
    ClassSerializerInterceptor
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger';

import { ShopManagementService } from './shop-management.service';
import { CreateShopManagementDto } from './dto/create-shop-management.dto';
import { UpdateShopManagementDto } from './dto/update-shop-management.dto';
import {
    ResponseShopManagementDto,
    QueryShopManagementDto,
    ShopManagementPaginationDto,
    ResponseShopManagementListDto
} from './dto/shop-management.dto';
import { EncodedIdParamDto } from './dto/encoded-id-param.dto';
import { HTTP_STATUS_MESSAGES } from 'src/constants/http-status.constant';
import { AdminAuthGuard } from 'src/guards/AuthAdmin.guard';
import { User } from 'src/decorators/user.decorator';
import { IdEncoderService } from 'src/utility/id-encoder.service';

@ApiTags('Shop Management')
@ApiBearerAuth()
@UseGuards(AdminAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('shop-management')
export class ShopManagementController {
    constructor(private readonly shopManagementService: ShopManagementService) { }

    @ApiOperation({
        summary: 'สร้างข้อมูลการจัดการร้านค้า',
        description: 'API สำหรับสร้างข้อมูลการจัดการร้านค้าใหม่'
    })
    @ApiResponse({ status: 200, description: HTTP_STATUS_MESSAGES[200], type: ResponseShopManagementDto })
    @ApiResponse({ status: 401, description: HTTP_STATUS_MESSAGES[401] })
    @ApiResponse({ status: 404, description: 'ไม่พบข้อมูลร้านค้า, เครื่อง, หรือโปรแกรม' })
    @ApiResponse({ status: 409, description: 'รหัสเครื่องหรือรหัส IoT ซ้ำกัน' })
    @HttpCode(HttpStatus.OK)
    @Post()
    async create(
        @User() userId: number,
        @Body() createShopManagementDto: CreateShopManagementDto
    ): Promise<ResponseShopManagementDto> {
        console.log('createShopManagementDto', createShopManagementDto)
        return await this.shopManagementService.create(createShopManagementDto, userId);
    }

    @ApiOperation({
        summary: 'ดึงรายการข้อมูลการจัดการร้านค้าแบบ pagination',
        description: 'API สำหรับดึงรายการข้อมูลการจัดการร้านค้าทั้งหมดพร้อมการแบ่งหน้า, การค้นหา และการเรียงลำดับ'
    })
    @ApiResponse({
        status: 200,
        description: HTTP_STATUS_MESSAGES[200],
        type: ShopManagementPaginationDto
    })
    @ApiResponse({ status: 401, description: HTTP_STATUS_MESSAGES[401] })
    @HttpCode(HttpStatus.OK)
    @Get()
    async findAll(@Query() query: QueryShopManagementDto): Promise<ShopManagementPaginationDto> {
        return await this.shopManagementService.findAll(query);
    }

    @ApiOperation({
        summary: 'ดึงรายการข้อมูลการจัดการร้านค้าแบบ list',
        description: 'API สำหรับดึงรายการข้อมูลการจัดการร้านค้าทั้งหมดในรูปแบบ list (สำหรับ dropdown)'
    })
    @ApiResponse({ status: 200, description: HTTP_STATUS_MESSAGES[200], type: ResponseShopManagementListDto, isArray: true })
    @ApiResponse({ status: 401, description: HTTP_STATUS_MESSAGES[401] })
    @HttpCode(HttpStatus.OK)
    @Get('list')
    async findList(): Promise<ResponseShopManagementListDto[]> {
        return await this.shopManagementService.findList();
    }

    @ApiOperation({
        summary: 'ดึงข้อมูลการจัดการร้านค้าตาม ID',
        description: 'API สำหรับดึงข้อมูลการจัดการร้านค้าตาม ID ที่เข้ารหัสแล้ว'
    })
    @ApiResponse({ status: 200, description: HTTP_STATUS_MESSAGES[200], type: ResponseShopManagementDto })
    @ApiResponse({ status: 401, description: HTTP_STATUS_MESSAGES[401] })
    @ApiResponse({ status: 404, description: 'ไม่พบข้อมูลการจัดการร้านค้า' })
    @HttpCode(HttpStatus.OK)
    @Get(':id')
    async findOne(@Param('id') encodedId: string): Promise<ResponseShopManagementDto> {
        try {
            const id = IdEncoderService.decode(encodedId);
            return await this.shopManagementService.findOne(id);
        } catch (error) {
            if (error.message.includes('Failed to decode')) {
                throw new BadRequestException('Invalid shop management ID format');
            }
            throw error;
        }
    }

    @ApiOperation({
        summary: 'อัพเดทข้อมูลการจัดการร้านค้า',
        description: 'API สำหรับอัพเดทข้อมูลการจัดการร้านค้าตาม ID ที่เข้ารหัสแล้ว'
    })
    @ApiResponse({ status: 200, description: HTTP_STATUS_MESSAGES[200], type: ResponseShopManagementDto })
    @ApiResponse({ status: 400, description: HTTP_STATUS_MESSAGES[400] })
    @ApiResponse({ status: 401, description: HTTP_STATUS_MESSAGES[401] })
    @ApiResponse({ status: 404, description: 'ไม่พบข้อมูลการจัดการร้านค้า, ร้านค้า, เครื่อง, หรือโปรแกรม' })
    @ApiResponse({ status: 409, description: 'รหัสเครื่องหรือรหัส IoT ซ้ำกัน' })
    @HttpCode(HttpStatus.OK)
    @Patch(':id')
    async update(
        @Param('id') encodedId: string,
        @Body() updateShopManagementDto: UpdateShopManagementDto,
        @User() userId: number
    ): Promise<ResponseShopManagementDto> {
        try {
            const id = IdEncoderService.decode(encodedId);
            return await this.shopManagementService.update(id, updateShopManagementDto, userId);
        } catch (error) {
            if (error.message.includes('Failed to decode')) {
                throw new BadRequestException('Invalid shop management ID format');
            }
            throw error;
        }
    }

    @ApiOperation({
        summary: 'ลบข้อมูลการจัดการร้านค้า',
        description: 'API สำหรับลบข้อมูลการจัดการร้านค้าตาม ID ที่เข้ารหัสแล้ว'
    })
    @ApiResponse({ status: 200, description: HTTP_STATUS_MESSAGES[200] })
    @ApiResponse({ status: 401, description: HTTP_STATUS_MESSAGES[401] })
    @ApiResponse({ status: 404, description: 'ไม่พบข้อมูลการจัดการร้านค้า' })
    @HttpCode(HttpStatus.OK)
    @Delete(':id')
    async remove(@Param('id') encodedId: string, @User() userId: number): Promise<{ message: string }> {
        try {
            const id = IdEncoderService.decode(encodedId);
            await this.shopManagementService.remove(id);
            return { message: 'Shop management deleted successfully' };
        } catch (error) {
            if (error.message.includes('Failed to decode')) {
                throw new BadRequestException('Invalid shop management ID format');
            }
            throw error;
        }
    }
}
