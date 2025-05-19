import { Body, Controller, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { MachineTransactionService } from './machine-transaction.service';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BodyPayloadMachineDTO, PayloadMachineDTO, ResponseMachineTransactionDTO } from './dto/machine-transaction.dto';
import { HTTP_STATUS_MESSAGES } from 'src/constants/http-status.constant';

@ApiTags('Machine Transaction')
@Controller('machine-transaction')
export class MachineTransactionController {
    constructor(private readonly machineTransactionService: MachineTransactionService) { }

    @Post()
    @ApiBody({ type: BodyPayloadMachineDTO, isArray: true })
    @ApiResponse({ status: 200, description: HTTP_STATUS_MESSAGES[200], type: ResponseMachineTransactionDTO })
    @ApiResponse({ status: 401, description: HTTP_STATUS_MESSAGES[401] })
    @HttpCode(HttpStatus.OK)
    async setMachine(
        // @Query('idIoT') idIoT: string,
        @Body() payload: BodyPayloadMachineDTO[],
    ): Promise<ResponseMachineTransactionDTO> {
        return this.machineTransactionService.setMachineTransaction()
    }
}
