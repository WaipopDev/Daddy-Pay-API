import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, UseInterceptors, UploadedFile, Query, BadRequestException, ClassSerializerInterceptor, UnauthorizedException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ShopInfoService } from './shop-info.service';
import { CreateShopBankDto, CreateShopInfoDto } from './dto/create-shop-info.dto';
import { CreateShopInfoMultipartDto } from './dto/create-shop-info-multipart.dto';
import { ResponseUpdateShopInfoDto, UpdateShopInfoDto } from './dto/update-shop-info.dto';
import { ApiBearerAuth, ApiResponse, ApiTags, ApiConsumes, ApiBody, ApiQuery, ApiOperation } from '@nestjs/swagger';
import { HTTP_STATUS_MESSAGES } from 'src/constants/http-status.constant';
import { AdminAuthGuard } from 'src/guards/AuthAdmin.guard';
import { User } from 'src/decorators/user.decorator';
import { ResponseShopInfoListDto, SortDto, PaginatedShopInfoResponseDto, ResponseShopInfoDto, ResponseShopInfoListUserDto } from './dto/shoo-info.dto';
import { EncodedIdParamDto } from './dto/encoded-id-param.dto';
import { IdEncoderService } from 'src/utility/id-encoder.service';
import { PaginationDto } from 'src/constants/pagination.constant';
import { Pagination } from 'nestjs-typeorm-paginate';

@ApiTags('Shop Info')
@ApiBearerAuth()
@UseGuards(AdminAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('shop-info')
export class ShopInfoController {
    constructor(private readonly shopInfoService: ShopInfoService) { }

    @ApiResponse({ status: 200, description: HTTP_STATUS_MESSAGES[200] })
    @ApiResponse({ status: 401, description: HTTP_STATUS_MESSAGES[401] })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Shop information with file upload',
        type: CreateShopInfoMultipartDto,
    })
    @HttpCode(HttpStatus.OK)
    @Post()
    @UseInterceptors(FileInterceptor('shopUploadFile'))
    async create(
        @User() userId: number,
        @Body() createShopInfoMultipartDto: CreateShopInfoMultipartDto,
        @UploadedFile() file: Express.Multer.File
    ) { 

        const createShopInfoDto: CreateShopInfoDto = {
            // shopKey: createShopInfoMultipartDto.shopKey,
            shopCode: createShopInfoMultipartDto.shopCode,
            shopName: createShopInfoMultipartDto.shopName,
            shopAddress: createShopInfoMultipartDto.shopAddress || '',
            shopContactInfo: createShopInfoMultipartDto.shopContactInfo || '',
            shopMobilePhone: createShopInfoMultipartDto.shopMobilePhone || '',
            shopEmail: createShopInfoMultipartDto.shopEmail || '',
            shopLatitude: createShopInfoMultipartDto.shopLatitude || '',
            shopLongitude: createShopInfoMultipartDto.shopLongitude || '',
            shopStatus: createShopInfoMultipartDto.shopStatus,
            shopSystemName: createShopInfoMultipartDto.shopSystemName,
            shopTaxName: createShopInfoMultipartDto.shopTaxName || '',
            shopTaxId: createShopInfoMultipartDto.shopTaxId || '',
            shopTaxAddress: createShopInfoMultipartDto.shopTaxAddress || '',
            shopBankAccount: createShopInfoMultipartDto.shopBankAccount,
            shopBankAccountNumber: createShopInfoMultipartDto.shopBankAccountNumber,
            shopBankName: createShopInfoMultipartDto.shopBankName,
            shopBankBranch: createShopInfoMultipartDto.shopBankBranch,
        };
        
        return this.shopInfoService.create(createShopInfoDto, userId, file);
    }

    @ApiOperation({ 
        summary: 'ดึงรายการข้อมูลร้านค้าแบบ pagination', 
        description: 'API สำหรับดึงรายการข้อมูลร้านค้าทั้งหมดพร้อมการแบ่งหน้าและการเรียงลำดับ (ID เข้ารหัสด้วย @EncodeId decorator)' 
    })
    @ApiResponse({ 
        status: 200, 
        description: HTTP_STATUS_MESSAGES[200],
        type: PaginatedShopInfoResponseDto
    })
    @ApiResponse({ status: 401, description: HTTP_STATUS_MESSAGES[401] })
    @Get()
    findAll(
        @Query() option: PaginationDto,
        @Query() sort: SortDto,
    ): Promise<Pagination<ResponseShopInfoDto>> {
        return this.shopInfoService.findAll(option, sort);
    }

    @ApiResponse({ status: 200, description: HTTP_STATUS_MESSAGES[200], type: ResponseShopInfoListDto, isArray: true })
    @ApiResponse({ status: 401, description: HTTP_STATUS_MESSAGES[401] })
    @HttpCode(HttpStatus.OK)
    @Get('list')
    findList(
        @User() userId: number,
    ):Promise<ResponseShopInfoListDto[]> {
        return this.shopInfoService.findList(userId);
    }

    @ApiResponse({ status: 200, description: HTTP_STATUS_MESSAGES[200], type: ResponseShopInfoListUserDto, isArray: true })
    @ApiResponse({ status: 401, description: HTTP_STATUS_MESSAGES[401] })
    @HttpCode(HttpStatus.OK)
    @Get('list-user')
    findListUser():Promise<ResponseShopInfoListUserDto[]> { 
        return this.shopInfoService.findListUser();
    }

    @ApiOperation({ 
        summary: 'ดึงข้อมูลร้านค้าตาม ID', 
        description: 'API สำหรับดึงข้อมูลร้านค้าตาม ID ที่เข้ารหัสแล้ว' 
    })
    @ApiResponse({ status: 200, description: HTTP_STATUS_MESSAGES[200] })
    @ApiResponse({ status: 401, description: HTTP_STATUS_MESSAGES[401] })
    @ApiResponse({ status: 404, description: 'ไม่พบข้อมูลร้านค้า' })
    @Get(':id')
    async findOne(@Param('id') encodedId: string): Promise<ResponseUpdateShopInfoDto | null> {
        try {
            const id = IdEncoderService.decode(encodedId);
            return this.shopInfoService.findOne(id);
        } catch (error) {
            throw new UnauthorizedException('Invalid shop ID format');
        }
    }

    
    @ApiOperation({ 
        summary: 'อัพเดทข้อมูลร้านค้า', 
        description: 'API สำหรับอัพเดทข้อมูลร้านค้าตาม ID ที่เข้ารหัสแล้ว' 
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Shop information with file upload',
        type: UpdateShopInfoDto,
    })
    @ApiResponse({ status: 200, description: HTTP_STATUS_MESSAGES[200] })
    @ApiResponse({ status: 401, description: HTTP_STATUS_MESSAGES[401] })
    @ApiResponse({ status: 404, description: 'ไม่พบข้อมูลร้านค้า' })
    @Patch(':id')
    @UseInterceptors(FileInterceptor('shopUploadFile'))
    async update(
        @Param('id') encodedId: string, 
        @Body() updateShopInfoDto: UpdateShopInfoDto,
        @UploadedFile() file: Express.Multer.File
    ){
        try {
            const id = IdEncoderService.decode(encodedId);
            return this.shopInfoService.update(id, updateShopInfoDto, file);
        } catch (error) {
            throw new UnauthorizedException('Invalid shop ID format');
        }
    }

    @ApiOperation({ 
        summary: 'ลบข้อมูลร้านค้า', 
        description: 'API สำหรับลบข้อมูลร้านค้าตาม ID ที่เข้ารหัสแล้ว' 
    })
    @ApiResponse({ status: 200, description: HTTP_STATUS_MESSAGES[200] })
    @ApiResponse({ status: 401, description: HTTP_STATUS_MESSAGES[401] })
    @ApiResponse({ status: 404, description: 'ไม่พบข้อมูลร้านค้า' })
    @Delete(':id')
    async remove(@Param('id') encodedId: string) {
        try {
            const id = IdEncoderService.decode(encodedId);
            return this.shopInfoService.remove(id);
        } catch (error) {
            throw new UnauthorizedException('Invalid shop ID format');
        }
    }

    @ApiOperation({ 
        summary: 'ดึงข้อมูลธนาคาร', 
        description: 'API สำหรับดึงข้อมูลธนาคาร' 
    })
    @ApiResponse({ status: 200, description: HTTP_STATUS_MESSAGES[200] })
    @ApiResponse({ status: 401, description: HTTP_STATUS_MESSAGES[401] })
    @Get('bank/:id')
    findBank(@Param('id') encodedId: string) { 
        const id = IdEncoderService.decode(encodedId);
        return this.shopInfoService.findBank(id);
    }

    @ApiOperation({ 
        summary: 'บันทึกข้อมูลธนาคาร', 
        description: 'API สำหรับดึงข้อมูลธนาคาร' 
    })
    @ApiResponse({ status: 200, description: HTTP_STATUS_MESSAGES[200] })
    @ApiResponse({ status: 401, description: HTTP_STATUS_MESSAGES[401] })
    @ApiResponse({ status: 404, description: 'ไม่พบข้อมูลร้านค้า' })
    @Post('bank/:id')
    createOrUpdateBank(
        @User() userId: number,
        @Param('id') encodedId: string, 
        @Body() body: CreateShopBankDto
    ) { 
        const id = IdEncoderService.decode(encodedId);
        if (!id) {
            throw new UnauthorizedException('Invalid shop ID format');
        }
        return this.shopInfoService.createOrUpdateBank(id, body, userId);
    }
}
