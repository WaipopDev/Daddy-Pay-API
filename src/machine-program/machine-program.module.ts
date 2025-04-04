import { Module } from '@nestjs/common';
import { MachineProgramService } from './machine-program.service';
import { MachineProgramController } from './machine-program.controller';

@Module({
  controllers: [MachineProgramController],
  providers: [MachineProgramService],
})
export class MachineProgramModule {}
