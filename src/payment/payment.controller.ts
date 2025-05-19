import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { HTTP_STATUS_MESSAGES } from 'src/constants/http-status.constant';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponsePaymentDTO } from './dto/payment.dto';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }

    @Get(':idMachine/:programId')
    @ApiResponse({ status: 200, description: HTTP_STATUS_MESSAGES[200], type: ResponsePaymentDTO })
    @ApiResponse({ status: 401, description: HTTP_STATUS_MESSAGES[401] })
    @HttpCode(HttpStatus.OK)
    async getMachine(
        @Query('idMachine') idMachine: string,
        @Query('programId') programId: string,
    ): Promise<ResponsePaymentDTO> {
        return this.paymentService.getPayment()
    }
}
