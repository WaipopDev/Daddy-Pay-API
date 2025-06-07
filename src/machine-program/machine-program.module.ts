import { Module } from '@nestjs/common';
import { MachineProgramService } from './machine-program.service';
import { MachineProgramController } from './machine-program.controller';
import { MachineProgramRepository } from 'src/repositories/MachineProgram.repository';
import { MachineInfoRepository } from 'src/repositories/MachineInfo.repository';
import { ShopInfoRepository } from 'src/repositories/ShopInfo.repository';
import { ProgramInfoRepository } from 'src/repositories/ProgramInfo.repository';
import { KeyGeneratorService } from 'src/utility/key-generator.service';
import { AdminAuthModule } from 'src/admin-auth/admin-auth.module';

@Module({
  imports: [AdminAuthModule],
  controllers: [MachineProgramController],
  providers: [
    MachineProgramService,
    MachineProgramRepository,
    MachineInfoRepository,
    ShopInfoRepository,
    ProgramInfoRepository,
    KeyGeneratorService,
  ],
  exports: [MachineProgramService, MachineProgramRepository]
})
export class MachineProgramModule {}
