import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { MachineProgramService } from './machine-program.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { HTTP_STATUS_MESSAGES } from 'src/constants/http-status.constant';
import { ListMachineDTO } from './dto/machine-program.dto';

@ApiTags('Machine Program')
@Controller('machine-program')
export class MachineProgramController {
    constructor(private readonly machineProgramService: MachineProgramService) { }

    @Get(':idIoT')
    @ApiResponse({ status: 200, description: HTTP_STATUS_MESSAGES[200], type: ListMachineDTO })
    @ApiResponse({ status: 401, description: HTTP_STATUS_MESSAGES[401] })
    @HttpCode(HttpStatus.OK)
    async getMachine(
        @Query('idIoT') idIoT: string,
    ): Promise<ListMachineDTO> {
        return this.machineProgramService.getMachine()
    }
}
