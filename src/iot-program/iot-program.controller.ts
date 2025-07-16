import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException } from '@nestjs/common';
import { IotProgramService } from './iot-program.service';
import { CreateIotProgramDto } from './dto/create-iot-program.dto';
import { UpdateIotProgramDto } from './dto/update-iot-program.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IoTAuthGuard } from 'src/guards/AuthIoT.guard';

@ApiTags('IoT-Program')
@ApiBearerAuth()
@UseGuards(IoTAuthGuard)
@Controller('iot-program')
export class IotProgramController {
    constructor(private readonly iotProgramService: IotProgramService) { }

    @Get(':id')
    findOne(@Param('id') id: string) {
        if (!id) {
            throw new BadRequestException('ID is required');
        }
        return this.iotProgramService.findOne(id);
    }
}
