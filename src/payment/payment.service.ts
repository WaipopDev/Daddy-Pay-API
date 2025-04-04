import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentService {

    async getPayment(): Promise<any> {
        return {
            status: 'success',
            qrRawData: 'qrRawData',
            transactionIdCall: 'transactionIdCall',
        };
    }
}
