import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
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
import { ApplicationMiddleware } from './middlewares/application.middleware';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { LoggingInterceptor } from './Interceptors/logging.interceptor';
import { LoggerRepository } from './repositories/Logger.repository';
import { LanguageModule } from './language/language.module';
import { ShopInfoModule } from './shop-info/shop-info.module';
import { IdEncoderExceptionFilter } from './filters/id-encoder-exception.filter';
import { MachineInfoModule } from './machine-info/machine-info.module';
import { ProgramInfoModule } from './program-info/program-info.module';
import { ShopManagementModule } from './shop-management/shop-management.module';
import { IotProgramModule } from './iot-program/iot-program.module';
import { IotMachineModule } from './iot-machine/iot-machine.module';
import { IotPaymentModule } from './iot-payment/iot-payment.module';
import { ReportModule } from './report/report.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env']
        }),
        DADDY_PAY_DB,
        AuthModule,
        IotProgramModule,
        IotMachineModule,
        IotPaymentModule,
        
        MachineModule,
        MachineProgramModule,
        MachineTransactionModule,
        PaymentModule,
        FirebaseModule,
        KbankModule,
        AdminAuthModule,
        AdminMeModule,
        LanguageModule,
        ShopInfoModule,
        MachineInfoModule,
        ProgramInfoModule,
        ShopManagementModule,
        ReportModule,
    ],
    controllers: [AppController],
    providers: [
        { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
        { provide: APP_FILTER, useClass: IdEncoderExceptionFilter },
        LoggerRepository,
        AppService
    ],
})

export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(ApplicationMiddleware)
            .forRoutes({ path: '/*path', method: RequestMethod.ALL });
    }
}
