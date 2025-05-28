import { Module } from '@nestjs/common';
import { ShopInfoService } from './shop-info.service';
import { ShopInfoController } from './shop-info.controller';
import { AdminAuthModule } from 'src/admin-auth/admin-auth.module';
import { ShopInfoRepository } from 'src/repositories/ShopInfo.repository';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  imports: [AdminAuthModule, FirebaseModule],
  controllers: [ShopInfoController],
  providers: [ShopInfoService, ShopInfoRepository],
})
export class ShopInfoModule {}
