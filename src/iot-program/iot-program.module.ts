import { Module } from '@nestjs/common';
import { IotProgramService } from './iot-program.service';
import { IotProgramController } from './iot-program.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ShopManagementRepository } from 'src/repositories/ShopManagement.repository';
import { ShopInfoRepository } from 'src/repositories/ShopInfo.repository';

@Module({
  imports: [AuthModule],
  controllers: [IotProgramController],
  providers: [IotProgramService, ShopManagementRepository, ShopInfoRepository],
})
export class IotProgramModule {}
