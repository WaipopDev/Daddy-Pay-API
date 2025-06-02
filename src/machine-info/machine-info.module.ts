import { Module } from '@nestjs/common';
import { MachineInfoService } from './machine-info.service';
import { MachineInfoController } from './machine-info.controller';
import { MachineInfoRepository } from 'src/repositories/MachineInfo.repository';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { AdminAuthModule } from 'src/admin-auth/admin-auth.module';

@Module({
  imports: [AdminAuthModule,FirebaseModule],
  controllers: [MachineInfoController],
  providers: [MachineInfoService, MachineInfoRepository],
  exports: [MachineInfoService, MachineInfoRepository],
})
export class MachineInfoModule {}
