import { Injectable } from '@nestjs/common';
import { ResponseDTO } from './dto/machine-transaction.dto';

@Injectable()
export class MachineTransactionService {

    async setMachineTransaction(): Promise<ResponseDTO> {
        return {
            status: 'success',
            message: 'Machine transaction set successfully',
        };
    }
}
