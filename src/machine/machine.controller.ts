import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { MachineService } from './machine.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { HTTP_STATUS_MESSAGES } from 'src/constants/http-status.constant';
import { ListMachineDTO, MachineDTO, PayloadMachineDTO } from './dto/machine.dto';

@ApiTags('Machine')
@Controller('machine')
export class MachineController {
    constructor(private readonly machineService: MachineService) { }
    
    

    @Post(':idMachine')
    @ApiResponse({ status: 200, description: HTTP_STATUS_MESSAGES[200], type: MachineDTO })
    @ApiResponse({ status: 401, description: HTTP_STATUS_MESSAGES[401] })
    @HttpCode(HttpStatus.OK)
    async setMachine(
        @Query('idMachine') idMachine: string,
        @Body() payload: PayloadMachineDTO,
    ): Promise<MachineDTO> {
        return this.machineService.setMachine()
    }
}
