import { Module } from '@nestjs/common';
import { ShopInfoService } from './shop-info.service';
import { ShopInfoController } from './shop-info.controller';
import { AdminAuthModule } from 'src/admin-auth/admin-auth.module';
import { ShopInfoRepository } from 'src/repositories/ShopInfo.repository';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { UserModule } from 'src/user/user.module';
import { ShopInfoOnlinePaymentCronService } from './shop-info-online-payment.cron';
import { ShopInfoSubscriptionCronService } from './shop-info-subscription.cron';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [AdminAuthModule, FirebaseModule, UserModule, MailModule],
  controllers: [ShopInfoController],
  providers: [
    ShopInfoService,
    ShopInfoRepository,
    ShopInfoOnlinePaymentCronService,
    ShopInfoSubscriptionCronService,
  ],
})
export class ShopInfoModule {}
