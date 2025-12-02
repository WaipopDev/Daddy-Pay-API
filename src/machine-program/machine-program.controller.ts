import { Controller, Get, Post, Body, HttpCode, HttpStatus, Param, Query, UnauthorizedException, UseGuards, UseInterceptors, ClassSerializerInterceptor, Delete, Patch } from '@nestjs/common';
import { MachineProgramService } from './machine-program.service';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { HTTP_STATUS_MESSAGES } from 'src/constants/http-status.constant';
import { MachineProgramResponseDto, ResponseMachineProgramAllDto, ResponseMachineProgramDto, UpdateMachineProgramDto } from './dto/machine-program.dto';
import { IdEncoderService } from 'src/utility/id-encoder.service';
import { AdminAuthGuard } from 'src/guards/AuthAdmin.guard';
import { User } from 'src/decorators/user.decorator';
import { CreateMachineProgramDto } from './dto/create-machine-program.dto';

@ApiTags('Machine Program')
@ApiBearerAuth()
@UseGuards(AdminAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('machine-program')
export class MachineProgramController {
    constructor(private readonly machineProgramService: MachineProgramService) { }

    @ApiOperation({
        summary: 'สร้างข้อมูลโปรแกรมเครื่อง',
        description: 'API สำหรับสร้างข้อมูลโปรแกรมเครื่องใหม่'
    })
    @ApiResponse({ status: 200, description: HTTP_STATUS_MESSAGES[200], type: ResponseMachineProgramDto })
    @ApiResponse({ status: 400, description: HTTP_STATUS_MESSAGES[400] })
    @ApiResponse({ status: 401, description: HTTP_STATUS_MESSAGES[401] })
    @ApiResponse({ status: 404, description: 'ไม่พบข้อมูลร้านค้า/เครื่อง/โปรแกรม' })
    @HttpCode(HttpStatus.OK)
    @Post()
    async create(
        @User() userId: number,
        @Body() createMachineProgramDto: CreateMachineProgramDto
    ): Promise<ResponseMachineProgramDto> {
        return this.machineProgramService.create(createMachineProgramDto, userId);
    }

    @ApiOperation({
        summary: 'ดึงข้อมูลโปรแกรมตาม Machine ID',
        description: 'API สำหรับดึงข้อมูลโปรแกรมทั้งหมดของเครื่องตาม Machine ID ที่เข้ารหัสแล้ว'
    })
    @ApiResponse({
        status: 200,
        description: HTTP_STATUS_MESSAGES[200],
        type: MachineProgramResponseDto,
        isArray: true
    })
    @ApiResponse({ status: 401, description: HTTP_STATUS_MESSAGES[401] })
    @ApiResponse({ status: 404, description: 'ไม่พบข้อมูลเครื่อง' })
    @HttpCode(HttpStatus.OK)
    @Get('machine/:id')
    async findByMachine(@Param('id') encodedId: string): Promise<MachineProgramResponseDto[]> {
        try {
            const id = IdEncoderService.decode(encodedId);
            if (!id) {
                throw new UnauthorizedException('Invalid machine ID format');
            }
            return await this.machineProgramService.findByMachine(id);
        } catch (error) {
            if (error.message.includes('Failed to decode')) {
                throw new UnauthorizedException('Invalid machine ID format');
            }
            throw error;
        }
    }

    @ApiResponse({ status: 401, description: HTTP_STATUS_MESSAGES[401] })
    @HttpCode(HttpStatus.OK)
    @Get()
    async findAll(
        @Query('idMachine') encodedMachineId: string,
        @Query('idShop') encodedShopId: string
    ): Promise<ResponseMachineProgramAllDto[]> {
        const idMachine = IdEncoderService.decode(encodedMachineId);
        const idShop = IdEncoderService.decode(encodedShopId);
        if (!idMachine || !idShop) {
            throw new UnauthorizedException('Invalid machine or shop ID format');
        }
        return this.machineProgramService.findAll(idMachine, idShop);
    }

    @ApiOperation({
        summary: 'อัปเดตข้อมูลโปรแกรม',
        description: 'API สำหรับอัปเดตข้อมูลโปรแกรมตาม ID ที่เข้ารหัสแล้ว'
    })
    @ApiResponse({ status: 200, description: HTTP_STATUS_MESSAGES[200] })
    @ApiResponse({ status: 401, description: HTTP_STATUS_MESSAGES[401] })
    @ApiResponse({ status: 404, description: 'ไม่พบข้อมูลโปรแกรม' })
    @HttpCode(HttpStatus.OK)
    @Patch(':id')
    async update(
        @Param('id') encodedId: string,
        @Body() updateMachineProgramDto: UpdateMachineProgramDto
    ): Promise<ResponseMachineProgramDto> {
        try {
            const id = IdEncoderService.decode(encodedId);
            if (!id) {
                throw new UnauthorizedException('Invalid program ID format');
            }
            return await this.machineProgramService.update(id, updateMachineProgramDto);
        } catch (error) {
            if (error.message.includes('Failed to decode')) {
                throw new UnauthorizedException('Invalid program ID format');
            }
            throw error;
        }
    }

    @ApiOperation({
        summary: 'ลบข้อมูลโปรแกรม',
        description: 'API สำหรับลบข้อมูลโปรแกรมตาม ID ที่เข้ารหัสแล้ว'
    })
    @ApiResponse({ status: 200, description: HTTP_STATUS_MESSAGES[200] })
    @ApiResponse({ status: 401, description: HTTP_STATUS_MESSAGES[401] })
    @ApiResponse({ status: 404, description: 'ไม่พบข้อมูลโปรแกรม' })
    @HttpCode(HttpStatus.OK)
    @Delete(':id')
    async remove(@Param('id') encodedId: string, @User() userId: number): Promise<{ message: string }> {
        try {
            const id = IdEncoderService.decode(encodedId);
            if (!id) {
                throw new UnauthorizedException('Invalid program ID format');
            }
            await this.machineProgramService.remove(id, userId);
            return { message: 'Program deleted successfully' };
        } catch (error) {
            if (error.message.includes('Failed to decode')) {
                throw new UnauthorizedException('Invalid program ID format');
            }
            throw error;
        }
    }
}
