import { Module } from '@nestjs/common';
import { ShopManagementService } from './shop-management.service';
import { ShopManagementController } from './shop-management.controller';
import { AdminAuthModule } from 'src/admin-auth/admin-auth.module';
import { ShopManagementRepository } from 'src/repositories/ShopManagement.repository';
import { ShopInfoRepository } from 'src/repositories/ShopInfo.repository';
import { MachineInfoRepository } from 'src/repositories/MachineInfo.repository';
import { ProgramInfoRepository } from 'src/repositories/ProgramInfo.repository';
import { KeyGeneratorService } from 'src/utility/key-generator.service';

@Module({
  imports: [AdminAuthModule],
  controllers: [ShopManagementController],
  providers: [
    ShopManagementService,
    ShopManagementRepository,
    ShopInfoRepository,
    MachineInfoRepository,
    ProgramInfoRepository,
    KeyGeneratorService,
  ],
  exports: [ShopManagementService, ShopManagementRepository],
})
export class ShopManagementModule {}
