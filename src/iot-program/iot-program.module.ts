import { Module } from '@nestjs/common';
import { IotProgramService } from './iot-program.service';
import { IotProgramController } from './iot-program.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ShopManagementRepository } from 'src/repositories/ShopManagement.repository';

@Module({
  imports: [AuthModule],
  controllers: [IotProgramController],
  providers: [IotProgramService, ShopManagementRepository],
})
export class IotProgramModule {}
