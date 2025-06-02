import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, UseInterceptors, UploadedFile, Query, BadRequestException, ClassSerializerInterceptor } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MachineInfoService } from './machine-info.service';
import { CreateMachineInfoDto } from './dto/create-machine-info.dto';
import { CreateMachineInfoMultipartDto } from './dto/create-machine-info-multipart.dto';
import { UpdateMachineInfoDto } from './dto/update-machine-info.dto';
import { ApiBearerAuth, ApiResponse, ApiTags, ApiConsumes, ApiBody, ApiQuery, ApiOperation } from '@nestjs/swagger';
import { HTTP_STATUS_MESSAGES } from 'src/constants/http-status.constant';
import { AdminAuthGuard } from 'src/guards/AuthAdmin.guard';
import { User } from 'src/decorators/user.decorator';
import { ResponseMachineInfoListDto, SortDto, PaginatedMachineInfoResponseDto, ResponseMachineInfoDto } from './dto/machine-info.dto';
import { EncodedIdParamDto } from './dto/encoded-id-param.dto';
import { IdEncoderService } from 'src/utility/id-encoder.service';
import { PaginationDto } from 'src/constants/pagination.constant';
import { Pagination } from 'nestjs-typeorm-paginate';

@ApiTags('Machine Info')
@ApiBearerAuth()
@UseGuards(AdminAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('machine-info')
export class MachineInfoController {
    constructor(private readonly machineInfoService: MachineInfoService) { }

    @ApiResponse({ status: 200, description: HTTP_STATUS_MESSAGES[200] })
    @ApiResponse({ status: 401, description: HTTP_STATUS_MESSAGES[401] })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Machine information with file upload',
        type: CreateMachineInfoMultipartDto,
    })
    @HttpCode(HttpStatus.OK)
    @Post()
    @UseInterceptors(FileInterceptor('machinePictureFile'))
    async create(
        @User() userId: number,
        @Body() createMachineInfoMultipartDto: CreateMachineInfoMultipartDto,
        @UploadedFile() file?: Express.Multer.File
    ) { 

        const createMachineInfoDto: CreateMachineInfoDto = {
            machineType: createMachineInfoMultipartDto.machineType,
            machineBrand: createMachineInfoMultipartDto.machineBrand,
            machineModel: createMachineInfoMultipartDto.machineModel,
            machineDescription: createMachineInfoMultipartDto.machineDescription || '',
        };
        
        return this.machineInfoService.create(createMachineInfoDto, userId, file);
    }

    @ApiOperation({ 
        summary: 'ดึงรายการข้อมูลเครื่องแบบ pagination', 
        description: 'API สำหรับดึงรายการข้อมูลเครื่องทั้งหมดพร้อมการแบ่งหน้าและการเรียงลำดับ (ID เข้ารหัสด้วย @EncodeId decorator)' 
    })
    @ApiResponse({ 
        status: 200, 
        description: HTTP_STATUS_MESSAGES[200],
        type: PaginatedMachineInfoResponseDto
    })
    @ApiResponse({ status: 401, description: HTTP_STATUS_MESSAGES[401] })
    @Get()
    findAll(
        @Query() option: PaginationDto,
        @Query() sort: SortDto,
    ): Promise<Pagination<ResponseMachineInfoDto>> {
        return this.machineInfoService.findAll(option, sort);
    }

    @ApiResponse({ status: 200, description: HTTP_STATUS_MESSAGES[200], type: ResponseMachineInfoListDto, isArray: true })
    @ApiResponse({ status: 401, description: HTTP_STATUS_MESSAGES[401] })
    @HttpCode(HttpStatus.OK)
    @Get('list')
    findList(): Promise<ResponseMachineInfoListDto[]> {
        return this.machineInfoService.findList();
    }

    @ApiOperation({ 
        summary: 'ดึงข้อมูลเครื่องตาม ID', 
        description: 'API สำหรับดึงข้อมูลเครื่องตาม ID ที่เข้ารหัสแล้ว' 
    })
    @ApiResponse({ status: 200, description: HTTP_STATUS_MESSAGES[200] })
    @ApiResponse({ status: 401, description: HTTP_STATUS_MESSAGES[401] })
    @ApiResponse({ status: 404, description: 'ไม่พบข้อมูลเครื่อง' })
    @Get(':id')
    async findOne(@Param('id') encodedId: string): Promise<ResponseMachineInfoDto | null> {
        try {
            const id = IdEncoderService.decode(encodedId);
            return this.machineInfoService.findOne(id);
        } catch (error) {
            throw new BadRequestException('Invalid machine ID format');
        }
    }

    @ApiOperation({ 
        summary: 'อัพเดทข้อมูลเครื่อง', 
        description: 'API สำหรับอัพเดทข้อมูลเครื่องตาม ID ที่เข้ารหัสแล้ว' 
    })
    @ApiResponse({ status: 200, description: HTTP_STATUS_MESSAGES[200] })
    @ApiResponse({ status: 401, description: HTTP_STATUS_MESSAGES[401] })
    @ApiResponse({ status: 404, description: 'ไม่พบข้อมูลเครื่อง' })
    @Patch(':id')
    async update(@Param('id') encodedId: string, @Body() updateMachineInfoDto: UpdateMachineInfoDto, @User() userId: number) {
        try {
            const id = IdEncoderService.decode(encodedId);
            return this.machineInfoService.update(id, updateMachineInfoDto, userId);
        } catch (error) {
            throw new BadRequestException('Invalid machine ID format');
        }
    }

    @ApiOperation({ 
        summary: 'ลบข้อมูลเครื่อง', 
        description: 'API สำหรับลบข้อมูลเครื่องตาม ID ที่เข้ารหัสแล้ว' 
    })
    @ApiResponse({ status: 200, description: HTTP_STATUS_MESSAGES[200] })
    @ApiResponse({ status: 401, description: HTTP_STATUS_MESSAGES[401] })
    @ApiResponse({ status: 404, description: 'ไม่พบข้อมูลเครื่อง' })
    @Delete(':id')
    async remove(@Param('id') encodedId: string) {
        try {
            const id = IdEncoderService.decode(encodedId);
            return this.machineInfoService.remove(id);
        } catch (error) {
            throw new BadRequestException('Invalid machine ID format');
        }
    }
}
