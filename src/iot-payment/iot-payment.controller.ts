import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { IotPaymentService } from './iot-payment.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IoTAuthGuard } from 'src/guards/AuthIoT.guard';
import { IotPaymentQRPaymentRequestDto } from './dto/iot-payment.dto';

@ApiTags('IoT-Payment')
@ApiBearerAuth()
@UseGuards(IoTAuthGuard)
@Controller('iot-payment')
export class IotPaymentController {
  constructor(private readonly iotPaymentService: IotPaymentService) {}

  @Get('get-qrpayment')
  @ApiOperation({ summary: 'Get QR Payment' })
  @ApiResponse({ status: 200, description: 'QR Payment' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async getQRPayment(@Query() query: IotPaymentQRPaymentRequestDto) {
    return this.iotPaymentService.getQRPayment(query);
  }
}
