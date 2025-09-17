import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { IotPaymentService } from './iot-payment.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IoTAuthGuard } from 'src/guards/AuthIoT.guard';
import { IotPaymentCheckPaymentRequestDto, IotPaymentQRPaymentRequestDto } from './dto/iot-payment.dto';

@ApiTags('IoT-Payment')
@ApiBearerAuth()
@UseGuards(IoTAuthGuard)
@Controller('iot-payment')
export class IotPaymentController {
    constructor(private readonly iotPaymentService: IotPaymentService) { }

    @Get('get-qrpayment')
    @ApiOperation({ summary: 'Get QR Payment' })
    @ApiResponse({ status: 200, description: 'QR Payment' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async getQRPayment(@Query() query: IotPaymentQRPaymentRequestDto) {
        return this.iotPaymentService.getQRPayment(query);
    }

    @Post('check-payment')
    @ApiOperation({ summary: 'Check Payment' })
    @ApiResponse({ status: 200, description: 'Check Payment' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async checkPayment(@Body() query: IotPaymentCheckPaymentRequestDto) {
        return this.iotPaymentService.checkPayment(query);
    }
}
