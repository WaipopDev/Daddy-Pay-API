import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ShopInfoService } from './shop-info.service';
import { ShopInfoController } from './shop-info.controller';
import { AdminAuthModule } from 'src/admin-auth/admin-auth.module';
import { ShopInfoRepository } from 'src/repositories/ShopInfo.repository';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { IdEncoderExceptionFilter } from 'src/filters/id-encoder-exception.filter';
import { IdEncoderService } from 'src/utility/id-encoder.service';

@Module({
  imports: [AdminAuthModule, FirebaseModule],
  controllers: [ShopInfoController],
  providers: [
    ShopInfoService, 
    ShopInfoRepository,
    IdEncoderService,
    {
      provide: APP_FILTER,
      useClass: IdEncoderExceptionFilter,
    },
  ],
})
export class ShopInfoModule {}
