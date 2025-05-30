import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ShopInfoService } from './shop-info.service';
import { CreateShopInfoDto } from './dto/create-shop-info.dto';
import { CreateShopInfoMultipartDto } from './dto/create-shop-info-multipart.dto';
import { UpdateShopInfoDto } from './dto/update-shop-info.dto';
import { ApiBearerAuth, ApiResponse, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { HTTP_STATUS_MESSAGES } from 'src/constants/http-status.constant';
import { AdminAuthGuard } from 'src/guards/AuthAdmin.guard';
import { User } from 'src/decorators/user.decorator';

@ApiTags('Shop Info')
@ApiBearerAuth()
@UseGuards(AdminAuthGuard)
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

    @Get()
    findAll() {
        return this.shopInfoService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.shopInfoService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateShopInfoDto: UpdateShopInfoDto) {
        return this.shopInfoService.update(+id, updateShopInfoDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.shopInfoService.remove(+id);
    }
}
