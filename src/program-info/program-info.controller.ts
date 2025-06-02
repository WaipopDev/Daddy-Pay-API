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
import { ApiBearerAuth, ApiResponse, ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

import { ProgramInfoService } from './program-info.service';
import { CreateProgramInfoDto } from './dto/create-program-info.dto';
import { UpdateProgramInfoDto } from './dto/update-program-info.dto';
import { ResponseProgramInfoDto, QueryProgramInfoDto, ProgramInfoPaginationDto } from './dto/program-info.dto';
import { EncodedIdParamDto } from './dto/encoded-id-param.dto';
import { HTTP_STATUS_MESSAGES } from 'src/constants/http-status.constant';
import { AdminAuthGuard } from 'src/guards/AuthAdmin.guard';
import { User } from 'src/decorators/user.decorator';
import { IdEncoderService } from 'src/utility/id-encoder.service';

@ApiTags('Program Info')
@ApiBearerAuth()
@UseGuards(AdminAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('program-info')
export class ProgramInfoController {
  constructor(private readonly programInfoService: ProgramInfoService) {}

  @ApiOperation({ 
    summary: 'สร้างข้อมูลโปรแกรม', 
    description: 'API สำหรับสร้างข้อมูลโปรแกรมใหม่' 
  })
  @ApiResponse({ status: 201, description: HTTP_STATUS_MESSAGES[201], type: ResponseProgramInfoDto })
  @ApiResponse({ status: 400, description: HTTP_STATUS_MESSAGES[400] })
  @ApiResponse({ status: 401, description: HTTP_STATUS_MESSAGES[401] })
  @ApiResponse({ status: 404, description: 'ไม่พบข้อมูลเครื่อง' })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @User() userId: number,
    @Body() createProgramInfoDto: CreateProgramInfoDto
  ): Promise<ResponseProgramInfoDto> {
    return this.programInfoService.create(createProgramInfoDto, userId);
  }

  @ApiOperation({ 
    summary: 'ดึงรายการข้อมูลโปรแกรมแบบ pagination', 
    description: 'API สำหรับดึงรายการข้อมูลโปรแกรมทั้งหมดพร้อมการแบ่งหน้าและการเรียงลำดับ' 
  })
  @ApiResponse({ 
    status: 200, 
    description: HTTP_STATUS_MESSAGES[200],
    type: ProgramInfoPaginationDto
  })
  @ApiResponse({ status: 401, description: HTTP_STATUS_MESSAGES[401] })
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(@Query() query: QueryProgramInfoDto): Promise<ProgramInfoPaginationDto> {
    return this.programInfoService.findAll(query);
  }

  @ApiOperation({ 
    summary: 'ดึงข้อมูลโปรแกรมตาม ID', 
    description: 'API สำหรับดึงข้อมูลโปรแกรมตาม ID ที่เข้ารหัสแล้ว' 
  })
  @ApiResponse({ status: 200, description: HTTP_STATUS_MESSAGES[200], type: ResponseProgramInfoDto })
  @ApiResponse({ status: 401, description: HTTP_STATUS_MESSAGES[401] })
  @ApiResponse({ status: 404, description: 'ไม่พบข้อมูลโปรแกรม' })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id') encodedId: string): Promise<ResponseProgramInfoDto> {
    try {
      return await this.programInfoService.findOne(encodedId);
    } catch (error) {
      if (error.message.includes('Failed to decode')) {
        throw new BadRequestException('Invalid program ID format');
      }
      throw error;
    }
  }

  @ApiOperation({ 
    summary: 'อัพเดทข้อมูลโปรแกรม', 
    description: 'API สำหรับอัพเดทข้อมูลโปรแกรมตาม ID ที่เข้ารหัสแล้ว' 
  })
  @ApiResponse({ status: 200, description: HTTP_STATUS_MESSAGES[200], type: ResponseProgramInfoDto })
  @ApiResponse({ status: 400, description: HTTP_STATUS_MESSAGES[400] })
  @ApiResponse({ status: 401, description: HTTP_STATUS_MESSAGES[401] })
  @ApiResponse({ status: 404, description: 'ไม่พบข้อมูลโปรแกรม' })
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async update(
    @Param('id') encodedId: string, 
    @Body() updateProgramInfoDto: UpdateProgramInfoDto,
    @User() userId: number
  ): Promise<ResponseProgramInfoDto> {
    try {
      return await this.programInfoService.update(encodedId, updateProgramInfoDto, userId);
    } catch (error) {
      if (error.message.includes('Failed to decode')) {
        throw new BadRequestException('Invalid program ID format');
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
      await this.programInfoService.remove(encodedId, userId);
      return { message: 'Program deleted successfully' };
    } catch (error) {
      if (error.message.includes('Failed to decode')) {
        throw new BadRequestException('Invalid program ID format');
      }
      throw error;
    }
  }
}
