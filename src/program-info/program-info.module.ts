import { Module } from '@nestjs/common';
import { ProgramInfoService } from './program-info.service';
import { ProgramInfoController } from './program-info.controller';
import { ProgramInfoRepository } from 'src/repositories/ProgramInfo.repository';
import { MachineInfoRepository } from 'src/repositories/MachineInfo.repository';
import { KeyGeneratorService } from 'src/utility/key-generator.service';
import { AdminAuthModule } from 'src/admin-auth/admin-auth.module';

@Module({
  imports: [AdminAuthModule],
  controllers: [ProgramInfoController],
  providers: [
    ProgramInfoService,
    ProgramInfoRepository,
    MachineInfoRepository,
    KeyGeneratorService,
  ],
  exports: [ProgramInfoService, ProgramInfoRepository]
})
export class ProgramInfoModule {}
