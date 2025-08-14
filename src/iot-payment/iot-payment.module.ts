import { Module } from '@nestjs/common';
import { IotPaymentService } from './iot-payment.service';
import { IotPaymentController } from './iot-payment.controller';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { AuthModule } from 'src/auth/auth.module';
import { KbankService } from 'src/bank/kbank/kbank.service';
import { MachineProgramRepository } from 'src/repositories/MachineProgram.repository';
import { ShopManagementRepository } from 'src/repositories/ShopManagement.repository';

@Module({
  imports: [FirebaseModule, AuthModule],
  controllers: [IotPaymentController],
  providers: [IotPaymentService, KbankService, MachineProgramRepository, ShopManagementRepository],
})
export class IotPaymentModule {}
