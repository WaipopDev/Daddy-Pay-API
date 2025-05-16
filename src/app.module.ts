import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MachineModule } from './machine/machine.module';
import { MachineProgramModule } from './machine-program/machine-program.module';
import { MachineTransactionModule } from './machine-transaction/machine-transaction.module';
import { PaymentModule } from './payment/payment.module';
import { FirebaseModule } from './firebase/firebase.module';
import { KbankModule } from './bank/kbank/kbank.module';
import { DADDY_PAY_DB } from './config/databases';
import { AdminAuthModule } from './admin-auth/admin-auth.module';
import { AdminMeModule } from './admin-me/admin-me.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env']
        }),
        DADDY_PAY_DB,
        AuthModule,
        MachineModule,
        MachineProgramModule,
        MachineTransactionModule,
        PaymentModule,
        FirebaseModule,
        KbankModule,
        AdminAuthModule,
        AdminMeModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
