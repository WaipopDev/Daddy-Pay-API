import { Controller, UseGuards, Post, Body } from '@nestjs/common';
import { IotMachineService } from './iot-machine.service';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IoTAuthGuard } from 'src/guards/AuthIoT.guard';
import { MachineProgramRequestDto } from './dto/machine-program-request.dto';

@ApiTags('IoT-Machine')
@ApiBearerAuth()
@UseGuards(IoTAuthGuard)
@Controller('iot-machine')
export class IotMachineController {
  constructor(private readonly iotMachineService: IotMachineService) {}

  @Post('machine-program')
  @ApiOperation({ 
    summary: 'Process machine program request',
    description: 'Handle machine program operation with ID and program key'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Machine program processed successfully' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid input data' 
  })
  async processMachineProgram(@Body() body: MachineProgramRequestDto) {
    return this.iotMachineService.processMachineProgram(body);
  }
}
