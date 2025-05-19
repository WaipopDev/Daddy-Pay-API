import { Injectable } from '@nestjs/common';
import { ResponseMachineTransactionDTO } from './dto/machine-transaction.dto';

@Injectable()
export class MachineTransactionService {

    async setMachineTransaction(): Promise<ResponseMachineTransactionDTO> {
        return {
            status: 'success',
            message: 'Machine transaction set successfully',
        };
    }
}
