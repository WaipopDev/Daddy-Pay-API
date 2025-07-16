import { Module } from '@nestjs/common';
import { IotMachineService } from './iot-machine.service';
import { IotMachineController } from './iot-machine.controller';
import { AuthModule } from 'src/auth/auth.module';
import { MachineTransactionRepository } from 'src/repositories/MachineTransaction.repository';
import { ShopManagementRepository } from 'src/repositories/ShopManagement.repository';
import { ProgramInfoRepository } from 'src/repositories/ProgramInfo.repository';
import { MachineProgramRepository } from 'src/repositories/MachineProgram.repository';

@Module({
  imports: [AuthModule],
  controllers: [IotMachineController],
  providers: [IotMachineService, MachineTransactionRepository, ShopManagementRepository, ProgramInfoRepository, MachineProgramRepository],
})
export class IotMachineModule {}
