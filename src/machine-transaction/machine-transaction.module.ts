import { Module } from '@nestjs/common';
import { MachineTransactionService } from './machine-transaction.service';
import { MachineTransactionController } from './machine-transaction.controller';

@Module({
  controllers: [MachineTransactionController],
  providers: [MachineTransactionService],
})
export class MachineTransactionModule {}
